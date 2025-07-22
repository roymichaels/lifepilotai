import React, { createContext, useContext, useState, useCallback } from 'react';
import { Message } from '@/components/dashboard/ChatMessage';
import { sendChatMessage } from '@/api/chat';
import { generateWidgets } from '@/api/widgets';
import { useCharacter } from '@/hooks/useCharacter';
import { useProjectStorage } from '@/hooks/useProjectStorage';

type AuraState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface ChatContextType {
  messages: Message[];
  activeWidgets: any[];
  auraState: AuraState;
  sendMessage: (content: string) => Promise<void>;
  setAuraState: (state: AuraState) => void;
  handleWidgetAction: (action: string, data?: any) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [auraState, setAuraState] = useState<AuraState>('idle');
  const { activeProject, updateProject } = useProjectStorage();

  // Get project-specific data
  const messages = activeProject?.chatHistory || [];
  const activeWidgets = activeProject?.widgets || [];

  const sendMessage = useCallback(async (content: string): Promise<string> => {
    if (!activeProject) return '';

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    updateProject(activeProject.id, { chatHistory: updatedMessages });
    setAuraState('thinking');

    try {
      console.log('Sending message to Aura:', content);
      const response = await sendChatMessage(content);

      const auraMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'aura',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, auraMessage];
      updateProject(activeProject.id, { chatHistory: finalMessages });

      // Generate new widgets based on the conversation context
      const widgetResponse = await generateWidgets(content, activeWidgets.map(w => w.id));

      if (widgetResponse.widgets && widgetResponse.widgets.length > 0) {
        const updatedWidgets = [...activeWidgets, ...widgetResponse.widgets];
        updateProject(activeProject.id, { widgets: updatedWidgets });
      }

      setAuraState('speaking');
      setTimeout(() => setAuraState('idle'), 2000);
      return response.message;
    } catch (error) {
      console.error('Error sending message:', error);
      setAuraState('idle');
      return '';
    }
  }, [activeProject, messages, activeWidgets, updateProject]);

  const handleWidgetAction = useCallback((action: string, data?: any) => {
    if (!activeProject) return;

    console.log('Widget action:', action, data);

    switch (action) {
      case 'toggle':
        // Handle task completion toggle
        const updatedWidgets = activeWidgets.map(widget => {
          if (widget.type === 'list') {
            return {
              ...widget,
              data: widget.data.map((item: any) =>
                item.id === data.id ? { ...item, completed: !item.completed } : item
              )
            };
          }
          return widget;
        });
        updateProject(activeProject.id, { widgets: updatedWidgets });
        break;
      case 'view-goals':
        // This will be handled by the parent component to open modals
        break;
      default:
        console.log('Unhandled action:', action);
    }
  }, [activeProject, activeWidgets, updateProject]);

  return (
    <ChatContext.Provider value={{
      messages,
      activeWidgets,
      auraState,
      sendMessage,
      setAuraState,
      handleWidgetAction
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
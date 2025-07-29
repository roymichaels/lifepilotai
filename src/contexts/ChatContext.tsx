/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { ChatMessage } from '@/types/chat';
import { sendChatMessage } from '@/api/chat';
import { generateWidgets } from '@/api/widgets';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { AuraMemoryService } from '@/services/AuraMemoryService';
import { TraitService } from '@/services/TraitService';
import { connect as connectWaku, send as sendWaku, listen as listenWaku } from '@/lib/waku';
import { getRuntimeConfig } from '@/lib/runtimeConfig';

type AuraState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface ChatContextType {
  messages: ChatMessage[];
  activeWidgets: any[];
  auraState: AuraState;
  sendMessage: (content: string) => Promise<void>;
  setAuraState: (state: AuraState) => void;
  handleWidgetAction: (action: string, data?: any) => void;
  proactiveTips: string[];
  refreshProactiveTips: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [auraState, setAuraState] = useState<AuraState>('idle');
  const { activeProject, updateProject } = useProjectStorage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [proactiveTips, setProactiveTips] = useState<string[]>([]);
  const enableWaku = getRuntimeConfig().enableWaku === true;

  const activeWidgets = useMemo(() => activeProject?.widgets ?? [], [activeProject?.widgets]);

  // Connect to Waku and listen for incoming chat messages when enabled
  useEffect(() => {
    if (!enableWaku || !navigator.onLine || !activeProject) return;
    let sub: { unsubscribe: () => Promise<void> } | null = null;

    const start = async () => {
      try {
        await connectWaku();
        sub = await listenWaku(async msg => {
          if (!activeProject) return;
          await AuraMemoryService.addMessage(activeProject.id, msg);
          setMessages(await AuraMemoryService.getConversation(activeProject.id));
        });
      } catch (err) {
        console.error('[waku] failed to start', err);
      }
    };

    start();

    return () => {
      sub?.unsubscribe?.();
    };
  }, [enableWaku, activeProject]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!activeProject) {
        setMessages([])
        setProactiveTips([])
        return
      }

      const convo = await AuraMemoryService.getConversation(activeProject.id)
      if (convo.length === 0) {
        const onboarding: ChatMessage = {
          sender: 'aura',
          text: "Let's build your system. First, tell me your Game — your mission.",
          timestamp: new Date().toISOString()
        }
        await AuraMemoryService.addMessage(activeProject.id, onboarding)
        setMessages([onboarding])
      } else {
        setMessages(convo)
      }

      const tips = await AuraMemoryService.getProactiveTips(activeProject.id)
      setProactiveTips(tips.map(t => t.tip))
      AuraMemoryService.startTipScheduler(activeProject.id)
    }

    loadConversation()

    return () => {
      if (activeProject) AuraMemoryService.stopTipScheduler(activeProject.id)
    }
  }, [activeProject])

  const sendMessage = useCallback(async (content: string): Promise<string> => {
    if (!activeProject) return '';

    const userMessage: ChatMessage = {
      sender: 'user',
      text: content,
      timestamp: new Date().toISOString()
    };
    await AuraMemoryService.addMessage(activeProject.id, userMessage);
    try {
      await TraitService.addFromInput(content, 'chat');
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Trait extraction failed', err);
    }
    if (enableWaku && navigator.onLine) {
      try {
        await connectWaku();
        await sendWaku(userMessage);
      } catch (err) {
        console.warn('[waku] failed to send user message', err);
      }
    }
    setMessages(await AuraMemoryService.getConversation(activeProject.id));
    setAuraState('thinking');

    try {
      if (import.meta.env.DEV) console.log('Sending message to Aura:', content);
      const response = await sendChatMessage(content);

      const auraMessage: ChatMessage = {
        sender: 'aura',
        text: response.message,
        timestamp: new Date().toISOString()
      };
      await AuraMemoryService.addMessage(activeProject.id, auraMessage);
      if (enableWaku && navigator.onLine) {
        try {
          await connectWaku();
          await sendWaku(auraMessage);
        } catch (err) {
          console.warn('[waku] failed to send aura message', err);
        }
      }
      setMessages(await AuraMemoryService.getConversation(activeProject.id));

      // Generate new widgets based on the conversation context
      const widgetResponse = await generateWidgets(content, activeWidgets.map(w => w.id));

      if (widgetResponse.widgets && widgetResponse.widgets.length > 0) {
        const updatedWidgets = [...activeWidgets, ...widgetResponse.widgets];
        await updateProject(activeProject.id, { widgets: updatedWidgets });
      }

      setAuraState('speaking');
      setTimeout(() => setAuraState('idle'), 2000);
      return response.message;
    } catch (error) {
      console.error('Error sending message:', error);
      setAuraState('idle');
      return '';
    }
  }, [activeProject, activeWidgets, updateProject, enableWaku]);

  const refreshProactiveTips = useCallback(async () => {
    if (!activeProject) return;
    const tips = await AuraMemoryService.getProactiveTips(activeProject.id);
    setProactiveTips(tips.map(t => t.tip));
  }, [activeProject]);

  const handleWidgetAction = useCallback(async (action: string, data?: any) => {
    if (!activeProject) return;

    if (import.meta.env.DEV) console.log('Widget action:', action, data);

    switch (action) {
      case 'toggle': {
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
        await updateProject(activeProject.id, { widgets: updatedWidgets });
        break;
      }
      case 'view-goals':
        // This will be handled by the parent component to open modals
        break;
      default:
        if (import.meta.env.DEV) console.log('Unhandled action:', action);
    }
  }, [activeProject, activeWidgets, updateProject]);

  return (
    <ChatContext.Provider value={{
      messages,
      activeWidgets,
      auraState,
      sendMessage,
      setAuraState,
      handleWidgetAction,
      proactiveTips,
      refreshProactiveTips
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

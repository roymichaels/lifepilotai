/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useChatContext } from '@/contexts/ChatContext';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface BottomChatSectionProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

export function BottomChatSection({ isExpanded, onToggle }: BottomChatSectionProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, auraState, setAuraState } = useChatContext();
  const { activeProject } = useProjectStorage();
  const { startRecording, stopRecording, transcript, setTranscript, isRecording } = useVoiceInput();
  const { speak, isSpeaking } = useTextToSpeech();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageToSend = (text ?? inputValue).trim();
    if (!messageToSend) return;

    const userMessage = messageToSend;
    if (import.meta.env.DEV)
      console.log("BottomChatSection - Sending message:", userMessage);
    setInputValue('');

    if (!activeProject) return;

    // Set Aura to thinking state
    setAuraState('thinking');

    try {
      // Send message through chat context
      const response = await sendMessage(userMessage);
      if (import.meta.env.DEV)
        console.log("BottomChatSection - Received AI response:", response);

      setAuraState('speaking');
      speak(response);
      setTimeout(() => setAuraState('idle'), 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setAuraState('idle');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
      setAuraState('idle');
    } else {
      setTranscript('');
      startRecording();
      setAuraState('listening');
    }
  };

  useEffect(() => {
    if (!isRecording && transcript) {
      handleSendMessage(transcript);
      setTranscript('');
    }
  }, [isRecording, transcript]);

  useEffect(() => {
    if (isSpeaking) {
      setAuraState('speaking');
    } else if (auraState === 'speaking') {
      setAuraState('idle');
    }
  }, [isSpeaking]);

  // Get recent messages for display (last 10)
  const recentMessages = messages.slice(-10);
  if (import.meta.env.DEV)
    console.log("BottomChatSection - Recent messages to display:", recentMessages);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10"
      style={{ zIndex: 1000 }}
      initial={{ height: '4rem' }}
      animate={{ height: isExpanded ? '20rem' : '4rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="h-full flex flex-col">
        {/* Collapse Button - only show when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="flex justify-center py-2 border-b border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => onToggle(false)}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ChevronDown className="h-4 w-4 mr-1" />
                Collapse Chat
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Chat Area */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {recentMessages.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <p>Start a conversation with Aura...</p>
                </div>
              ) : (
                recentMessages.map((msg, index) => {
                  if (import.meta.env.DEV)
                    console.log("BottomChatSection - Rendering message:", msg);
                  return (
                    <ChatMessage
                      key={`${msg.timestamp}-${index}`}
                      message={{
                        id: `${msg.timestamp}-${index}`,
                        text: msg.text,
                        sender: msg.sender as 'user' | 'aura',
                        timestamp: new Date(msg.timestamp)
                      }}
                    />
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Aura anything..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              onClick={() => !isExpanded && onToggle(true)}
            />
            <Button
              onClick={toggleVoiceInput}
              variant="ghost"
              size="icon"
              className={`text-white hover:bg-white/10 ${
                isRecording ? 'bg-red-500/20 text-red-400' : ''
              }`}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            {isRecording && (
              <span className="text-xs text-red-400">Listening...</span>
            )}
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

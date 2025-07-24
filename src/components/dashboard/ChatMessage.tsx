import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: {
    sender: 'user' | 'aura';
    text?: string;
    response?: string;
    content?: string;
    timestamp: string;
  };
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  console.log('[ChatMessage] Rendering message:', JSON.stringify(message, null, 2));
  console.log('[ChatMessage] Message text:', message.text);
  console.log('[ChatMessage] Message response:', message.response);
  console.log('[ChatMessage] Message content:', message.content);

  const isUser = message.sender === 'user';
  
  // Try different property names for the message content
  const messageContent = message.text || message.response || message.content || '';
  console.log('[ChatMessage] Final message content:', messageContent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <Avatar className="w-8 h-8">
        <AvatarFallback className={isUser ? 'bg-blue-500' : 'bg-purple-500'}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {messageContent}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
}

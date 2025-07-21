import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: {
    id?: string;
    sender: 'user' | 'aura';
    text?: string;
    timestamp: string;
  };
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, className }) => {
  const isUser = message.sender === 'user';
  const displayText = message.text || '';

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[80%] px-4 py-2 rounded-lg break-words',
          isUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm border'
        )}
      >
        {!isUser && (
          <div className="flex items-center mb-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-xs font-medium text-purple-600">Aura</span>
          </div>
        )}

        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {displayText || (
            <span className="text-gray-400 italic">
              {!isUser ? 'Aura is thinking...' : 'Message content unavailable'}
            </span>
          )}
        </div>

        <div className={cn(
          'text-xs mt-1 opacity-70',
          isUser ? 'text-blue-100' : 'text-gray-500'
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
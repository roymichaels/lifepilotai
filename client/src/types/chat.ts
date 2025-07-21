// Chat message types for the chat system
export interface ChatMessage {
  id?: string;
  sender: 'user' | 'aura';
  text?: string;
  timestamp: string;
}

// API response types for chat endpoints
export interface ChatApiResponse {
  success: boolean;
  response: string;
  context?: any;
}

// Chat context for maintaining conversation state
export interface ChatContext {
  projectId?: string;
  conversationId?: string;
  metadata?: Record<string, any>;
}

// Chat request payload
export interface ChatRequest {
  message: string;
  context?: ChatContext;
}
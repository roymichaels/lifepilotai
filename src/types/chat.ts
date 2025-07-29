// Chat message types for the chat system
export interface ChatMessage {
  id?: string;
  sender: 'user' | 'aura';
  text?: string;
  timestamp: string;
  pubkey?: string;
}

export interface ChatHistoryEntry {
  id: string;
  sender: 'user' | 'aura';
  content: string;
  timestamp?: string;
}

// API response types for chat endpoints
export interface ChatApiResponse {
  success: boolean;
  response: string;
  context?: ChatContext;
}

// Chat context for maintaining conversation state
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface ChatContextMetadata {
  [key: string]: JsonValue;
}

export interface ChatContext {
  projectId?: string;
  conversationId?: string;
  metadata?: ChatContextMetadata;
}

// Chat request payload
export interface ChatRequest {
  message: string;
  context?: ChatContext;
}

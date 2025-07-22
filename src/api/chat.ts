import api from './api';
import brain from '@/brain/Brain';

// Description: Send a chat message to Aura AI
// Endpoint: POST /ai/chat
// Request: { message: string, context?: any }
// Response: { success: boolean, response: string, context?: any }
export const sendChatMessage = async (message: string, context?: any) => {
  console.log('sendChatMessage - Called with message:', message);
  console.log('sendChatMessage - Context:', context);
  // Apply configured filters to the outgoing message
  const filteredMessage = brain.filters.reduce((msg, filter) => filter(msg), message);
  console.log('sendChatMessage - Using brain configuration:', brain);

  try {
    console.log('sendChatMessage - Making API request to /ai/chat');
    const response = await api.post('/ai/chat', { message: filteredMessage, context });
    console.log('sendChatMessage - API response received:', response.data);
    console.log('sendChatMessage - Response structure:', JSON.stringify(response.data, null, 2));
    console.log('sendChatMessage - Response.response field:', response.data.response);
    console.log('sendChatMessage - Response.success field:', response.data.success);
    return response.data;
  } catch (error: any) {
    console.error('sendChatMessage - API error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};
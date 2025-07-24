import api from './api';

// Description: Get user goals
// Endpoint: GET /goals
// Request: {}
// Response: { goals: Array<{ _id: string, title: string, progress: number, category: string, status: string }> }
export const getGoals = async () => {
  try {
    const response = await api.get('/goals');
    return response.data as {
      goals: Array<{ _id: string; title: string; progress: number; category: string; status: string }>;
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

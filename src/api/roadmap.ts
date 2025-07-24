import api from './api';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  requiredLevel: number;
  category: string;
  widgetType?: string;
}

// Description: Get roadmap milestones
// Endpoint: GET /roadmap
// Request: {}
// Response: { milestones: Milestone[] }
export const getRoadmap = async () => {
  try {
    const response = await api.get('/roadmap');
    return response.data as { milestones: Milestone[] };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

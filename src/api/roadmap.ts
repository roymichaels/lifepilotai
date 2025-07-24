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
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        milestones: [
          {
            id: 'milestone-1',
            title: 'Define Core Values',
            description: 'Discover what truly matters to you',
            completed: true,
            xpReward: 50,
            requiredLevel: 1,
            category: 'foundation',
            widgetType: 'values-wheel'
          },
          {
            id: 'milestone-2',
            title: 'Set First Goals',
            description: 'Create your initial set of life goals',
            completed: true,
            xpReward: 75,
            requiredLevel: 2,
            category: 'planning',
            widgetType: 'goals-progress'
          },
          {
            id: 'milestone-3',
            title: 'First Habit Streak',
            description: 'Maintain a habit for 7 consecutive days',
            completed: false,
            xpReward: 100,
            requiredLevel: 3,
            category: 'habits',
            widgetType: 'habit-streaks'
          },
          {
            id: 'milestone-4',
            title: 'Skill Assessment',
            description: 'Complete your first skills evaluation',
            completed: false,
            xpReward: 125,
            requiredLevel: 4,
            category: 'development',
            widgetType: 'skills-radar'
          },
          {
            id: 'milestone-5',
            title: 'Focus Master',
            description: 'Complete 10 deep focus sessions',
            completed: false,
            xpReward: 150,
            requiredLevel: 5,
            category: 'productivity',
            widgetType: 'focus-time'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/roadmap');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

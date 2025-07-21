import api from './api';

// Description: Get user goals
// Endpoint: GET /api/goals
// Request: {}
// Response: { goals: Array<{ _id: string, title: string, progress: number, category: string, status: string }> }
export const getGoals = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        goals: [
          {
            _id: '1',
            title: 'Master React Advanced Patterns',
            progress: 75,
            category: 'Learning',
            status: 'active'
          },
          {
            _id: '2',
            title: 'Complete Marathon Training',
            progress: 60,
            category: 'Fitness',
            status: 'active'
          },
          {
            _id: '3',
            title: 'Build Side Project',
            progress: 30,
            category: 'Career',
            status: 'active'
          },
          {
            _id: '4',
            title: 'Read 12 Books This Year',
            progress: 85,
            category: 'Personal',
            status: 'active'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/goals');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};
import api from './api';

// Description: Get user tasks
// Endpoint: GET /tasks
// Request: {}
// Response: { tasks: Array<{ _id: string, title: string, completed: boolean, category: string, estimatedTime: number }> }
export const getTasks = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        tasks: [
          {
            _id: '1',
            title: 'Review React documentation',
            completed: false,
            category: 'Learning',
            estimatedTime: 30
          },
          {
            _id: '2',
            title: 'Complete morning workout',
            completed: true,
            category: 'Fitness',
            estimatedTime: 45
          },
          {
            _id: '3',
            title: 'Write project proposal',
            completed: false,
            category: 'Work',
            estimatedTime: 60
          },
          {
            _id: '4',
            title: 'Call team meeting',
            completed: true,
            category: 'Work',
            estimatedTime: 30
          },
          {
            _id: '5',
            title: 'Practice meditation',
            completed: false,
            category: 'Wellness',
            estimatedTime: 15
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/tasks');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};
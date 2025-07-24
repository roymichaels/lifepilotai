import api from './api';

// Description: Get user achievements
// Endpoint: GET /achievements
// Request: {}
// Response: { achievements: Array<{ _id: string, title: string, description: string, icon: string }> }
export const getAchievements = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        achievements: [
          {
            _id: '1',
            title: 'First Steps',
            description: 'Completed your first task',
            icon: '🎯'
          },
          {
            _id: '2',
            title: 'Streak Master',
            description: 'Maintained a 7-day streak',
            icon: '🔥'
          },
          {
            _id: '3',
            title: 'Goal Crusher',
            description: 'Completed 5 goals',
            icon: '🏆'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/achievements');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get user rewards
// Endpoint: GET /rewards
// Request: {}
// Response: { rewards: Array<{ _id: string, title: string, description: string, unlocked: boolean }> }
export const getRewards = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        rewards: [
          {
            _id: '1',
            title: 'Neural Enhancement Badge',
            description: 'Unlock advanced features',
            unlocked: true
          },
          {
            _id: '2',
            title: 'Master Achiever',
            description: 'Complete 10 goals',
            unlocked: false
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/rewards');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

import api from './api';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: 'locked' | 'active' | 'done' | 'failed';
  widgetType?: string;
  category: string;
}

export interface Character {
  level: number;
  xp: number;
  xpToNext: number;
  currentJob: 'Strategist' | 'Zen Master' | 'Explorer';
  unlockedSkills: string[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  avatar: string;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  xpCost: number;
  unlocked: boolean;
  widgetType?: string;
  prerequisites: string[];
}

// Description: Get user character data
// Endpoint: GET /character
// Request: {}
// Response: { character: Character }
export const getCharacter = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        character: {
          level: 3,
          xp: 450,
          xpToNext: 550,
          currentJob: 'Strategist',
          unlockedSkills: ['core-values', 'goal-tracking', 'daily-focus'],
          activeQuests: [
            {
              id: 'quest-1',
              title: 'Morning Ritual Master',
              description: 'Complete your morning routine for 7 consecutive days',
              xpReward: 100,
              status: 'active',
              category: 'habits',
              widgetType: 'habit-streaks'
            },
            {
              id: 'quest-2',
              title: 'Skill Development',
              description: 'Update your skills radar with new competencies',
              xpReward: 75,
              status: 'active',
              category: 'skills'
            }
          ],
          completedQuests: [
            {
              id: 'quest-0',
              title: 'Define Core Values',
              description: 'Identify and prioritize your core life values',
              xpReward: 50,
              status: 'done',
              category: 'values',
              widgetType: 'values-wheel'
            }
          ],
          avatar: 'strategist-crest'
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/character');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Gain XP and update character
// Endpoint: POST /character/xp
// Request: { amount: number, source: string }
// Response: { character: Character, levelUp: boolean }
export const gainXP = async (amount: number, source: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        character: {
          level: 3,
          xp: 450 + amount,
          xpToNext: 550,
          currentJob: 'Strategist',
          unlockedSkills: ['core-values', 'goal-tracking', 'daily-focus'],
          activeQuests: [],
          completedQuests: [],
          avatar: 'strategist-crest'
        },
        levelUp: (450 + amount) >= 550
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/character/xp', { amount, source });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Complete a quest
// Endpoint: POST /character/quest/complete
// Request: { questId: string }
// Response: { character: Character, xpGained: number }
export const completeQuest = async (questId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        character: {
          level: 3,
          xp: 525,
          xpToNext: 550,
          currentJob: 'Strategist',
          unlockedSkills: ['core-values', 'goal-tracking', 'daily-focus'],
          activeQuests: [],
          completedQuests: [],
          avatar: 'strategist-crest'
        },
        xpGained: 75
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/character/quest/complete', { questId });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get skill tree for current job
// Endpoint: GET /character/skills
// Request: {}
// Response: { skills: SkillNode[] }
export const getSkillTree = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        skills: [
          {
            id: 'core-values',
            name: 'Core Values Discovery',
            description: 'Unlock the ability to define and track your core values',
            xpCost: 0,
            unlocked: true,
            widgetType: 'values-wheel',
            prerequisites: []
          },
          {
            id: 'goal-tracking',
            name: 'Goal Tracking System',
            description: 'Advanced goal setting and progress monitoring',
            xpCost: 100,
            unlocked: true,
            widgetType: 'goals-progress',
            prerequisites: ['core-values']
          },
          {
            id: 'habit-mastery',
            name: 'Habit Mastery',
            description: 'Unlock advanced habit tracking and streak bonuses',
            xpCost: 200,
            unlocked: false,
            widgetType: 'habit-streaks',
            prerequisites: ['goal-tracking']
          },
          {
            id: 'focus-mode',
            name: 'Deep Focus Mode',
            description: 'Advanced productivity tracking and focus sessions',
            xpCost: 300,
            unlocked: false,
            widgetType: 'focus-time',
            prerequisites: ['habit-mastery']
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/character/skills');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

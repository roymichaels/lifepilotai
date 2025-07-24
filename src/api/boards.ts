import api from './api';

export interface BoardCard {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  dueDate?: Date;
  estimate?: number;
  progress?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardColumn {
  id: string;
  title: string;
  cards: BoardCard[];
  color?: string;
  maxVisible?: number;
  order: number;
}

export interface Board {
  id: string;
  title: string;
  type: 'project' | 'habit' | 'skill' | 'mood' | 'vision' | 'reading' | 'focus';
  columns: BoardColumn[];
  projectId?: string;
}

// Description: Get boards for a project
// Endpoint: GET /boards
// Request: { projectId?: string, type?: string }
// Response: { boards: Board[] }
export const getBoards = async (projectId?: string, type?: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockBoards: Board[] = [
        {
          id: 'board-1',
          title: 'Project Tasks',
          type: 'project',
          projectId,
          columns: [
            {
              id: 'todo',
              title: 'To Do',
              order: 0,
              color: '#ef4444',
              cards: [
                {
                  id: 'card-1',
                  title: 'Design wireframes',
                  description: 'Create initial wireframes for the new feature',
                  tags: ['design', 'urgent'],
                  estimate: 4,
                  progress: 0,
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
                {
                  id: 'card-2',
                  title: 'Research competitors',
                  description: 'Analyze competitor solutions',
                  tags: ['research'],
                  estimate: 2,
                  progress: 0,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            },
            {
              id: 'doing',
              title: 'In Progress',
              order: 1,
              color: '#3b82f6',
              cards: [
                {
                  id: 'card-3',
                  title: 'Implement authentication',
                  description: 'Add user login and registration',
                  tags: ['development'],
                  estimate: 8,
                  progress: 60,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            },
            {
              id: 'done',
              title: 'Done',
              order: 2,
              color: '#10b981',
              cards: [
                {
                  id: 'card-4',
                  title: 'Setup project structure',
                  description: 'Initialize project with proper folder structure',
                  tags: ['setup'],
                  estimate: 1,
                  progress: 100,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            }
          ]
        }
      ];

      if (type === 'habit') {
        mockBoards.push({
          id: 'board-2',
          title: 'Habit Builder',
          type: 'habit',
          columns: [
            {
              id: 'ideas',
              title: 'Habit Ideas',
              order: 0,
              color: '#8b5cf6',
              cards: [
                {
                  id: 'habit-1',
                  title: 'Morning meditation',
                  description: '10 minutes daily meditation',
                  tags: ['wellness'],
                  metadata: { frequency: 'daily', streak: 0 },
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            },
            {
              id: 'active',
              title: 'Scheduled',
              order: 1,
              color: '#3b82f6',
              cards: [
                {
                  id: 'habit-2',
                  title: 'Daily exercise',
                  description: '30 minutes workout',
                  tags: ['fitness'],
                  metadata: { frequency: 'daily', streak: 7 },
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            },
            {
              id: 'completed',
              title: 'Mastered',
              order: 2,
              color: '#10b981',
              cards: [
                {
                  id: 'habit-3',
                  title: 'Drink 8 glasses water',
                  description: 'Stay hydrated throughout the day',
                  tags: ['health'],
                  metadata: { frequency: 'daily', streak: 30 },
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            }
          ]
        });
      }

      resolve({ boards: mockBoards });
    }, 500);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/boards', { params: { projectId, type } });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Move a card between columns
// Endpoint: POST /boards/move-card
// Request: { cardId: string, fromColumnId: string, toColumnId: string, boardId: string }
// Response: { success: boolean }
export const moveCard = async (cardId: string, fromColumnId: string, toColumnId: string, boardId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/boards/move-card', { cardId, fromColumnId, toColumnId, boardId });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Add a new card to a column
// Endpoint: POST /boards/add-card
// Request: { columnId: string, boardId: string, card: Partial<BoardCard> }
// Response: { card: BoardCard }
export const addCard = async (columnId: string, boardId: string, card: Partial<BoardCard>) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCard: BoardCard = {
        id: crypto.randomUUID(),
        title: card.title || 'New Card',
        description: card.description,
        tags: card.tags || [],
        estimate: card.estimate,
        progress: card.progress || 0,
        metadata: card.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      resolve({ card: newCard });
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/boards/add-card', { columnId, boardId, card });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update a card
// Endpoint: PUT /boards/update-card
// Request: { cardId: string, updates: Partial<BoardCard> }
// Response: { card: BoardCard }
export const updateCard = async (cardId: string, updates: Partial<BoardCard>) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        card: { 
          id: cardId, 
          ...updates, 
          updatedAt: new Date() 
        } 
      });
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/boards/update-card', { cardId, updates });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get board templates
// Endpoint: GET /boards/templates
// Request: {}
// Response: { templates: BoardTemplate[] }
export const getBoardTemplates = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        templates: [
          {
            id: 'project',
            name: 'Project Manager',
            type: 'project',
            columns: [
              { id: 'todo', title: 'To Do', color: '#ef4444', order: 0 },
              { id: 'doing', title: 'In Progress', color: '#3b82f6', order: 1 },
              { id: 'done', title: 'Done', color: '#10b981', order: 2 }
            ]
          },
          {
            id: 'habit',
            name: 'Habit Builder',
            type: 'habit',
            columns: [
              { id: 'ideas', title: 'Habit Ideas', color: '#8b5cf6', order: 0 },
              { id: 'active', title: 'Scheduled', color: '#3b82f6', order: 1 },
              { id: 'completed', title: 'Mastered', color: '#10b981', order: 2 }
            ]
          },
          {
            id: 'skill',
            name: 'Skill Roadmap',
            type: 'skill',
            columns: [
              { id: 'learning', title: 'Learning Goals', color: '#f59e0b', order: 0 },
              { id: 'practice', title: 'In Practice', color: '#3b82f6', order: 1 },
              { id: 'mastered', title: 'Mastered', color: '#10b981', order: 2 }
            ]
          },
          {
            id: 'mood',
            name: 'Mood Tracker',
            type: 'mood',
            columns: [
              { id: 'sad', title: '😢 Sad', color: '#6b7280', order: 0 },
              { id: 'neutral', title: '😐 Neutral', color: '#f59e0b', order: 1 },
              { id: 'good', title: '😊 Good', color: '#3b82f6', order: 2 },
              { id: 'great', title: '😄 Great', color: '#10b981', order: 3 }
            ]
          }
        ]
      });
    }, 300);
  });

  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/boards/templates');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

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
export const getBoards = async (
  projectId?: string,
  type?: string
): Promise<{ boards: Board[] }> => {
  try {
    const response = await api.get('/boards', { params: { projectId, type } });
    return response.data as { boards: Board[] };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Move a card between columns
// Endpoint: POST /boards/move-card
// Request: { cardId: string, fromColumnId: string, toColumnId: string, boardId: string }
// Response: { success: boolean }
export const moveCard = async (cardId: string, fromColumnId: string, toColumnId: string, boardId: string) => {
  try {
    const response = await api.post('/boards/move-card', {
      cardId,
      fromColumnId,
      toColumnId,
      boardId,
    });
    return response.data as { success: boolean };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Add a new card to a column
// Endpoint: POST /boards/add-card
// Request: { columnId: string, boardId: string, card: Partial<BoardCard> }
// Response: { card: BoardCard }
export const addCard = async (columnId: string, boardId: string, card: Partial<BoardCard>) => {
  try {
    const response = await api.post('/boards/add-card', { columnId, boardId, card });
    return response.data as { card: BoardCard };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update a card
// Endpoint: PUT /boards/update-card
// Request: { cardId: string, updates: Partial<BoardCard> }
// Response: { card: BoardCard }
export const updateCard = async (cardId: string, updates: Partial<BoardCard>) => {
  try {
    const response = await api.put('/boards/update-card', { cardId, updates });
    return response.data as { card: BoardCard };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get board templates
// Endpoint: GET /boards/templates
// Request: {}
// Response: { templates: BoardTemplate[] }
export const getBoardTemplates = async () => {

  try {
    const response = await api.get('/boards/templates');
    return response.data as { templates: any[] };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

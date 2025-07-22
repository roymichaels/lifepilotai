import { useState, useEffect, useCallback } from 'react';
import { Board, BoardCard, getBoards, moveCard, addCard, updateCard } from '@/api/boards';
import { useProjectStorage } from './useProjectStorage';
import { useCharacter } from './useCharacter';

export function useAuraBoard(boardType?: string) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeProject } = useProjectStorage();
  const { gainXP } = useCharacter();

  const fetchBoards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getBoards(activeProject?.id, boardType);
      setBoards((response as any).boards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch boards');
    } finally {
      setIsLoading(false);
    }
  }, [activeProject?.id, boardType]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleMoveCard = useCallback(async (cardId: string, fromColumnId: string, toColumnId: string) => {
    try {
      // Optimistically update the UI
      setBoards(prevBoards =>
        prevBoards.map(board => ({
          ...board,
          columns: board.columns.map(column => {
            if (column.id === fromColumnId) {
              return {
                ...column,
                cards: column.cards.filter(card => card.id !== cardId)
              };
            }
            if (column.id === toColumnId) {
              const cardToMove = board.columns
                .find(col => col.id === fromColumnId)
                ?.cards.find(card => card.id === cardId);

              if (cardToMove) {
                return {
                  ...column,
                  cards: [...column.cards, cardToMove]
                };
              }
            }
            return column;
          })
        }))
      );

      // Award XP based on column transition
      const targetColumn = boards[0]?.columns.find(col => col.id === toColumnId);
      if (targetColumn?.title.toLowerCase().includes('progress')) {
        await gainXP(10, 'Started Task');
      } else if (targetColumn?.title.toLowerCase().includes('done') || targetColumn?.title.toLowerCase().includes('complete')) {
        await gainXP(25, 'Completed Task');
      }

      // Make API call
      const boardId = boards[0]?.id;
      if (boardId) {
        await moveCard(cardId, fromColumnId, toColumnId, boardId);
      }
    } catch (err) {
      // Revert on error
      fetchBoards();
      setError(err instanceof Error ? err.message : 'Failed to move card');
    }
  }, [boards, fetchBoards, gainXP]);

  const handleAddCard = useCallback(async (columnId: string, cardData?: Partial<BoardCard>) => {
    try {
      const boardId = boards[0]?.id;
      if (!boardId) return;

      const response = await addCard(columnId, boardId, cardData || { title: 'New Card' });
      const newCard = (response as any).card;

      // Update local state
      setBoards(prevBoards =>
        prevBoards.map(board => ({
          ...board,
          columns: board.columns.map(column =>
            column.id === columnId
              ? { ...column, cards: [...column.cards, newCard] }
              : column
          )
        }))
      );

      // Award XP for creating a card
      await gainXP(5, 'Created Task');

      return newCard;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card');
    }
  }, [boards, gainXP]);

  const handleUpdateCard = useCallback(async (cardId: string, updates: Partial<BoardCard>) => {
    try {
      await updateCard(cardId, updates);

      // Update local state
      setBoards(prevBoards =>
        prevBoards.map(board => ({
          ...board,
          columns: board.columns.map(column => ({
            ...column,
            cards: column.cards.map(card =>
              card.id === cardId ? { ...card, ...updates } : card
            )
          }))
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card');
    }
  }, []);

  return {
    boards,
    isLoading,
    error,
    handleMoveCard,
    handleAddCard,
    handleUpdateCard,
    refetch: fetchBoards
  };
}
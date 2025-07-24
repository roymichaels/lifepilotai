import { useState, useEffect, useCallback } from 'react';
import { Character, Quest, getCharacter, gainXP as apiGainXP, completeQuest as apiCompleteQuest } from '@/api/character';
import { useProjectStorage } from './useProjectStorage';

export function useCharacter() {
  const [isLoading, setIsLoading] = useState(false);
  const [xpAnimation, setXpAnimation] = useState<{ amount: number; source: string } | null>(null);
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);
  const { activeProject, updateProject } = useProjectStorage();

  // Use project character data instead of separate character state
  const character = activeProject ? {
    level: activeProject.character.level,
    xp: activeProject.character.xp,
    xpToNext: activeProject.character.xpToNext,
    currentJob: activeProject.character.role,
    unlockedSkills: [],
    activeQuests: [],
    completedQuests: [],
    avatar: 'project-avatar'
  } : null;

  const gainXP = useCallback(async (amount: number, source: string) => {
    if (!activeProject) return;

    try {
      // Show XP animation
      setXpAnimation({ amount, source });

      // Calculate new XP and level
      const newXP = activeProject.character.xp + amount;
      const levelUp = newXP >= activeProject.character.xpToNext;
      const newLevel = levelUp ? activeProject.character.level + 1 : activeProject.character.level;
      const newXPToNext = levelUp ? activeProject.character.xpToNext + 100 : activeProject.character.xpToNext;

      // Update project character
      updateProject(activeProject.id, {
        character: {
          ...activeProject.character,
          xp: newXP,
          level: newLevel,
          xpToNext: newXPToNext
        }
      });

      if (levelUp) {
        setLevelUpAnimation(true);
        setTimeout(() => setLevelUpAnimation(false), 3000);
      }

      // Clear XP animation after 2 seconds
      setTimeout(() => setXpAnimation(null), 2000);
    } catch (error) {
      console.error('Error gaining XP:', error);
    }
  }, [activeProject, updateProject]);

  const completeQuest = useCallback(async (questId: string) => {
    if (!activeProject) return;

    try {
      // Mock quest completion - in real app this would call API
      const xpGained = 75;
      await gainXP(xpGained, 'Quest Completed');
    } catch (error) {
      console.error('Error completing quest:', error);
    }
  }, [activeProject, gainXP]);

  return {
    character,
    isLoading,
    xpAnimation,
    levelUpAnimation,
    gainXP,
    completeQuest
  };
}

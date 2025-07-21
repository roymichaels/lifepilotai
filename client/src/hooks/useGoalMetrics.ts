import { useState, useEffect } from 'react';

interface GoalMetrics {
  overallCompletion: number;
  completedGoals: number;
  totalGoals: number;
  previousCompleted: number;
  weeklyMomentum: Array<{ day: string; completed: number }>;
  categoryBreakdown: Array<{ name: string; value: number }>;
  growthOverTime: Array<{ period: string; progress: number }>;
  growthTrend: number;
}

export function useGoalMetrics() {
  const [metrics, setMetrics] = useState<GoalMetrics>({
    overallCompletion: 0,
    completedGoals: 0,
    totalGoals: 0,
    previousCompleted: 0,
    weeklyMomentum: [],
    categoryBreakdown: [],
    growthOverTime: [],
    growthTrend: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMetrics({
        overallCompletion: 68,
        completedGoals: 17,
        totalGoals: 25,
        previousCompleted: 14,
        weeklyMomentum: [
          { day: 'Mon', completed: 3 },
          { day: 'Tue', completed: 2 },
          { day: 'Wed', completed: 4 },
          { day: 'Thu', completed: 1 },
          { day: 'Fri', completed: 5 },
          { day: 'Sat', completed: 2 },
          { day: 'Sun', completed: 3 }
        ],
        categoryBreakdown: [
          { name: 'Health', value: 8 },
          { name: 'Career', value: 6 },
          { name: 'Learning', value: 5 },
          { name: 'Personal', value: 4 },
          { name: 'Finance', value: 2 }
        ],
        growthOverTime: [
          { period: 'Last Month', progress: 45 },
          { period: 'This Month', progress: 68 }
        ],
        growthTrend: 23
      });
      setIsLoading(false);
    }, 800);
  }, []);

  return { metrics, isLoading };
}
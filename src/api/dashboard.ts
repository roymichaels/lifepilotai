import { useState, useEffect } from 'react';

// Mock data hooks for dashboard widgets

export const useValuesData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { name: 'Growth', value: 25 },
        { name: 'Family', value: 20 },
        { name: 'Health', value: 18 },
        { name: 'Creativity', value: 15 },
        { name: 'Adventure', value: 12 },
        { name: 'Service', value: 10 }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, isLoading };
};

export const useSkillsData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { skill: 'Leadership', current: 7, target: 9 },
        { skill: 'Communication', current: 8, target: 9 },
        { skill: 'Technical', current: 6, target: 8 },
        { skill: 'Creativity', current: 5, target: 7 },
        { skill: 'Strategy', current: 6, target: 8 },
        { skill: 'Empathy', current: 8, target: 9 }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, isLoading };
};

export const useGoalsData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 1, title: 'Learn React Advanced Patterns', progress: 75, trend: '+15% this week' },
        { id: 2, title: 'Run 5K in under 25 minutes', progress: 60, trend: '+8% this week' },
        { id: 3, title: 'Read 24 books this year', progress: 45, trend: '+12% this month' },
        { id: 4, title: 'Build side project MVP', progress: 30, trend: '+20% this week' }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, isLoading };
};

export const useFocusData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 1, title: 'Complete project proposal', completed: false, priority: 'high' },
        { id: 2, title: 'Review team feedback', completed: true, priority: 'medium' },
        { id: 3, title: 'Update portfolio website', completed: false, priority: 'medium' },
        { id: 4, title: 'Plan weekend activities', completed: false, priority: 'low' },
        { id: 5, title: 'Call mom', completed: true, priority: 'high' }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const toggleTask = (taskId: number) => {
    setData((prevData: any) =>
      prevData?.map((task: any) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return { data, isLoading, toggleTask };
};

export const useMoodData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { date: 'Mon', mood: 4 },
        { date: 'Tue', mood: 3 },
        { date: 'Wed', mood: 5 },
        { date: 'Thu', mood: 4 },
        { date: 'Fri', mood: 5 },
        { date: 'Sat', mood: 4 },
        { date: 'Sun', mood: 4 }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, isLoading };
};

export const useHabitsData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 1, name: 'Morning Meditation', streak: 12, target: 7, thisWeek: 6 },
        { id: 2, name: 'Exercise', streak: 8, target: 5, thisWeek: 4 },
        { id: 3, name: 'Read for 30min', streak: 15, target: 7, thisWeek: 7 },
        { id: 4, name: 'Drink 8 glasses water', streak: 5, target: 7, thisWeek: 5 }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, isLoading };
};

import React from 'react';
import { motion } from 'framer-motion';
import { useHabitsData } from '@/api/dashboard';
import { Flame, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HabitStreaksProps {
  onAddHabit?: () => void;
  className?: string;
}
export function HabitStreaks({ onAddHabit, className = '', ...props }: HabitStreaksProps & any) {
  const { data: habitsData, isLoading } = useHabitsData();

  if (isLoading) {
    return (
      <motion.div {...props} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...props}
      className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64 overflow-y-auto ${className}`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Flame className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-white">Habit Streaks</h3>
      </div>

      <div className="space-y-4">
        {habitsData?.map((habit: any) => (
          <motion.div
            key={habit.id}
            className="bg-white/5 rounded-lg p-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-sm">{habit.name}</span>
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-bold">{habit.streak}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Target: {habit.target}/week</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>This week: {habit.thisWeek}/{habit.target}</span>
              </div>
            </div>

            <div className="mt-2 flex space-x-1">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-sm ${
                    index < habit.thisWeek
                      ? 'bg-green-400'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {onAddHabit && (
        <div className="mt-4">
          <Button size="sm" variant="secondary" className="w-full" onClick={onAddHabit}>
            Add Habit
          </Button>
        </div>
      )}
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useGoalsData } from '@/api/dashboard';
import { Target, TrendingUp } from 'lucide-react';

export function GoalProgressCards(props: any) {
  const { data: goalsData, isLoading } = useGoalsData();

  if (isLoading) {
    return (
      <motion.div {...props} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...props} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64 overflow-y-auto">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Goal Progress</h3>
      </div>
      
      <div className="space-y-4">
        {goalsData?.map((goal: any) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">{goal.title}</span>
              <span className="text-blue-400 text-sm">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
            <div className="flex items-center space-x-1 text-xs text-white/60">
              <TrendingUp className="w-3 h-3" />
              <span>{goal.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
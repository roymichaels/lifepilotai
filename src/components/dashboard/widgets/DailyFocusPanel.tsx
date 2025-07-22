import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useFocusData } from '@/api/dashboard';
import { Checklist, ChecklistItem } from '@/components/ui/checklist';

export function DailyFocusPanel(props: any) {
  const { data: focusData, isLoading, toggleTask } = useFocusData();

  if (isLoading) {
    return (
      <motion.div {...props} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Convert focus data to checklist items
  const checklistItems: ChecklistItem[] = focusData?.map((task: any) => ({
    id: task.id.toString(),
    title: task.title,
    completed: task.completed,
    priority: task.priority
  })) || [];

  const remaining = checklistItems.filter((c) => !c.completed).length;

  return (
    <motion.div {...props} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Daily Focus</h3>
      </div>

      <Checklist
        items={checklistItems}
        onToggle={(id) => toggleTask(parseInt(id))}
        showPriority={true}
        maxHeight="max-h-40"
      />

      <div className="mt-4 text-xs text-white/70 text-center">
        {remaining} task{remaining !== 1 ? 's' : ''} remaining
      </div>
    </motion.div>
  );
}
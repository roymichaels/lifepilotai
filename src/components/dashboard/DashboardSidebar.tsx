import React from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, TrendingUp, Calendar, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { icon: Target, label: 'Goals', id: 'goals' },
  { icon: Brain, label: 'Skills', id: 'skills' },
  { icon: TrendingUp, label: 'Progress', id: 'progress' },
  { icon: Calendar, label: 'Focus', id: 'focus' },
  { icon: Heart, label: 'Values', id: 'values' },
  { icon: Zap, label: 'Habits', id: 'habits' },
];

export function DashboardSidebar() {
  return (
    <motion.aside 
      className="w-16 bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-6 space-y-4"
      initial={{ x: -64 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {sidebarItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </Button>
        </motion.div>
      ))}
    </motion.aside>
  );
}
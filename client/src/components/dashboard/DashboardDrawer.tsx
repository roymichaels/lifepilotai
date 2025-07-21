import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Brain, TrendingUp, Calendar, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const drawerItems = [
  { icon: Target, label: 'Goals', id: 'goals' },
  { icon: Brain, label: 'Skills', id: 'skills' },
  { icon: TrendingUp, label: 'Progress', id: 'progress' },
  { icon: Calendar, label: 'Focus', id: 'focus' },
  { icon: Heart, label: 'Values', id: 'values' },
  { icon: Zap, label: 'Habits', id: 'habits' },
];

export function DashboardDrawer({ isOpen, onClose }: DashboardDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-slate-900 to-purple-900 backdrop-blur-md border-r border-white/10 z-50 p-6"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Navigation
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {drawerItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/10 hover:text-white p-4 h-auto"
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
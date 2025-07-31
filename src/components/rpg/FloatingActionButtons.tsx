import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Map, Scroll, Gamepad } from 'lucide-react';

interface FloatingActionButtonsProps {
  onOpenRoadmap: () => void;
  onOpenQuestLog: () => void;
  onToggleGameWorld: () => void;
  gameActive?: boolean;
}

export function FloatingActionButtons({ onOpenRoadmap, onOpenQuestLog, onToggleGameWorld, gameActive }: FloatingActionButtonsProps) {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col space-y-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={onOpenRoadmap}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          <Map className="w-6 h-6" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          onClick={onOpenQuestLog}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg"
        >
          <Scroll className="w-6 h-6" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Button
          onClick={onToggleGameWorld}
          size="icon"
          className={`w-14 h-14 rounded-full shadow-lg ${gameActive ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}
        >
          <Gamepad className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}

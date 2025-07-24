import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface EmptyWidgetProps {
  index: number;
}

export function EmptyWidget({ index }: EmptyWidgetProps) {
  return (
    <motion.div
      className="aspect-square p-4 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-500/30 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-purple-500/25 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center mb-2"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <MessageCircle className="w-4 h-4 text-white/40" />
      </motion.div>

      <p className="text-white/60 text-center text-xs font-medium">
        Chat with Aura
      </p>
    </motion.div>
  );
}

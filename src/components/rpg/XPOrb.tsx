import React from 'react';
import { motion } from 'framer-motion';

interface XPOrbProps {
  amount: number;
  startPosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onComplete: () => void;
}

export function XPOrb({ amount, startPosition, targetPosition, onComplete }: XPOrbProps) {
  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        left: startPosition.x,
        top: startPosition.y
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0.8],
        opacity: [0, 1, 1],
        x: targetPosition.x - startPosition.x,
        y: targetPosition.y - startPosition.y
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        duration: 1.5,
        ease: "easeInOut"
      }}
      onAnimationComplete={onComplete}
    >
      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white text-xs font-bold">+{amount}</span>
      </div>
    </motion.div>
  );
}

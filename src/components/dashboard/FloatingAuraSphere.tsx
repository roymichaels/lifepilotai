import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useSpherePosition } from '@/hooks/useSpherePosition';
import { useSphereMotion } from '@/hooks/useSphereMotion';
import { useChatContext } from '@/contexts/ChatContext';

interface FloatingAuraSphereProps {
  onActivate: () => void;
  traits?: string[];
}

export function FloatingAuraSphere({ onActivate, traits = [] }: FloatingAuraSphereProps) {
  const controls = useAnimation();
  const { auraState } = useChatContext();
  const [isHovered, setIsHovered] = useState(false);
  const isActive = auraState === 'listening' || auraState === 'speaking';
  
  // Use smooth position animation
  const { x, y } = useSpherePosition();
  const { mouseX, mouseY, isDragging } = useSphereMotion();

  // Smooth continuous floating animation
  useEffect(() => {
    const floatingAnimation = async () => {
      await controls.start({
        y: [0, -8, 0],
        transition: {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }
      });
    };
    
    floatingAnimation();
  }, [controls]);

  // Smooth breathing animation based on state
  const getBreathingAnimation = () => {
    switch (auraState) {
      case 'listening':
        return {
          scale: [1, 1.1, 1],
          transition: {
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }
        };
      case 'thinking':
        return {
          scale: [1, 1.05, 1],
          rotate: [0, 360],
          transition: {
            scale: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            },
            rotate: {
              duration: 8,
              ease: "linear",
              repeat: Infinity
            }
          }
        };
      case 'speaking':
        return {
          scale: [1, 1.15, 1],
          transition: {
            duration: 0.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }
        };
      default:
        return {
          scale: [1, 1.02, 1],
          transition: {
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }
        };
    }
  };

  // Smooth color transitions
  const getSphereColor = (t: string[]) => {
    if (t.includes('tech')) {
      return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    }
    if (t.includes('nature')) {
      return 'linear-gradient(135deg, #34d399, #059669)';
    }
    if (t.includes('creative')) {
      return 'linear-gradient(135deg, #ec4899, #db2777)';
    }
    switch (auraState) {
      case 'listening':
        return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'thinking':
        return 'linear-gradient(135deg, #6366f1, #4338ca)';
      case 'speaking':
        return 'linear-gradient(135deg, #10b981, #059669)';
      default:
        return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    }
  };

  const handleClick = () => {
    onActivate();
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: mouseX * 0.1, // Subtle mouse following
        y: mouseY * 0.1
      }}
      transition={{ 
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        x: { type: "spring", stiffness: 50, damping: 20 },
        y: { type: "spring", stiffness: 50, damping: 20 }
      }}
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
          opacity: isActive ? [0.5, 0.9, 0.5] : [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          background: getSphereColor(traits),
          filter: 'blur(8px)',
          width: '80px',
          height: '80px'
        }}
      />

      {/* Main sphere */}
      <motion.div
        animate={controls}
        className="relative w-16 h-16 rounded-full shadow-2xl"
        style={{
          background: getSphereColor(traits),
          boxShadow: `
            0 0 ${isActive ? 30 : 20}px rgba(139, 92, 246, 0.4),
            0 0 ${isActive ? 60 : 40}px rgba(139, 92, 246, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.3)
          `
        }}
      >
        {/* Inner breathing animation */}
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={getBreathingAnimation()}
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), transparent 50%)',
            filter: 'blur(1px)'
          }}
        />

        {/* Sparkle effects */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity
          }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 20}px`,
                left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 20}px`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </motion.div>

        {/* Pulse rings for active states */}
        {(auraState === 'listening' || auraState === 'speaking') && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: auraState === 'listening' ? '#f59e0b' : '#10b981'
            }}
            animate={{
              scale: [1, 2, 3],
              opacity: [0.8, 0.3, 0]
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
              repeat: Infinity
            }}
          />
        )}
      </motion.div>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.2 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5), transparent 70%)'
        }}
      />
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

interface HolographicSphere3DProps {
  isActive?: boolean;
  isPulsing?: boolean;
  isSpeaking?: boolean;
  size?: number;
  className?: string;
}

export function HolographicSphere3D({
  isActive = false,
  isPulsing = false,
  isSpeaking = false,
  size = 1,
  className = ''
}: HolographicSphere3DProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 relative overflow-hidden"
        style={{
          width: `${size * 64}px`,
          height: `${size * 64}px`
        }}
        animate={{
          scale: isSpeaking ? [1, 1.1, 1] : isPulsing ? [1, 1.05, 1] : 1,
          rotate: isActive ? 360 : 0,
        }}
        transition={{
          scale: {
            duration: isSpeaking ? 0.5 : 1,
            repeat: isSpeaking || isPulsing ? Infinity : 0,
            ease: "easeInOut"
          },
          rotate: {
            duration: 20,
            repeat: isActive ? Infinity : 0,
            ease: "linear"
          }
        }}
      >
        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: isActive ? [0.3, 0.7, 0.3] : 0.1,
          }}
          transition={{
            duration: 2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%)'
          }}
        />

        {/* Holographic layers */}
        <motion.div
          className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-600/30"
          animate={{
            rotate: isActive ? -360 : 0,
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            rotate: {
              duration: 15,
              repeat: isActive ? Infinity : 0,
              ease: "linear"
            },
            opacity: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />

        {/* Pulse rings for speaking */}
        {isSpeaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.6, 0.3, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/20"
              animate={{
                scale: [1, 1.8, 2.5],
                opacity: [0.4, 0.2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3
              }}
            />
          </>
        )}

        {/* 3D depth effect */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-t from-black/20 to-transparent" />
      </motion.div>

      {/* Floating particles around the sphere */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              animate={{
                x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
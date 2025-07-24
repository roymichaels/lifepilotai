// src/components/ui/aura-sphere.tsx

import { useRef, useEffect, useState, useCallback } from 'react'

interface HolographicSphere3DProps {
  isActive?: boolean
  isListening?: boolean
  isSpeaking?: boolean
  isPulsing?: boolean
  size?: number
  className?: string
}

export function HolographicSphere3D({
  isActive = false,
  isListening = false,
  isSpeaking = false,
  isPulsing = false,
  size = 1,
  className = ""
}: HolographicSphere3DProps) {
  const sphereRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const positionRef = useRef({ x: 0, y: 0 })
  const animationIdRef = useRef<number>()

  // Mouse tracking - using ref to avoid re-renders
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      mouseRef.current = { x, y }
    }

    window.addEventListener('mousemove', handleMouse)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  // Animation loop - using refs to avoid re-renders
  useEffect(() => {
    const startTime = Date.now();

    const animate = () => {
      try {
        if (!sphereRef.current) {
          animationIdRef.current = requestAnimationFrame(animate);
          return;
        }

        const time = (Date.now() - startTime) / 1000;

        // Cursor-following with comfortable offset and AI-like movement
        const isMobile = window.innerWidth < 768;
        const cursorInfluence = isMobile ? 0.1 : 0.3;

        // AI-like "thinking" drift
        const driftX = Math.sin(time * 0.1) * 20 + Math.cos(time * 0.07) * 10;
        const driftY = Math.cos(time * 0.12) * 15 + Math.sin(time * 0.08) * 10;

        // Behavioral "intent" zones - changes every 5 seconds
        const phase = Math.floor(time / 5) % 4;
        const intentBias = [
          [20, 0],    // lean right
          [-20, 0],   // lean left
          [0, 20],    // lean up
          [0, -20]    // lean down
        ][phase];

        // Combine all movement influences
        const homeX = driftX + intentBias[0];
        const homeY = driftY + intentBias[1];

        const targetX = homeX + (mouseRef.current.x * 50 - homeX) * cursorInfluence;
        const targetY = homeY + (mouseRef.current.y * 50 - homeY) * cursorInfluence;

        // Clamp to reasonable bounds
        const clampedX = Math.max(-80, Math.min(80, targetX));
        const clampedY = Math.max(-80, Math.min(80, targetY));

        // Smooth movement with lerp
        positionRef.current = {
          x: positionRef.current.x + (clampedX - positionRef.current.x) * 0.05,
          y: positionRef.current.y + (clampedY - positionRef.current.y) * 0.05
        };

        // Apply transform directly to DOM element to avoid re-renders
        if (sphereRef.current) {
          sphereRef.current.style.transform = `translate(-50%, -50%) translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
        }

        animationIdRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error("Error in animation loop:", error);
      }
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []); // Empty dependency array - only run once

  const sphereSize = 80 * size;
  const glowIntensity = (isActive || isPulsing) ? 1.5 : 1;

  // CSS keyframes as strings for dynamic injection
  const keyframes = `
    @keyframes holosphere-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes holosphere-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes holosphere-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes holosphere-ripple {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
  `;

  // Inject keyframes into document head if not already present
  useEffect(() => {
    const styleId = 'holosphere-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
  }, [keyframes]);

  const pulseAnimation = (isActive || isPulsing) ? 'holosphere-pulse 2s ease-in-out infinite' : 'none';
  const speakingAnimation = isSpeaking ? 'holosphere-bounce 0.5s ease-in-out infinite' : 'none';

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Main holographic sphere */}
      <div
        ref={sphereRef}
        className="absolute top-1/2 left-1/2 transition-all duration-100 ease-out"
        style={{
          width: `${sphereSize}px`,
          height: `${sphereSize}px`,
          transform: `translate(-50%, -50%)`, // Initial transform, will be updated by animation
          animation: `${pulseAnimation}, ${speakingAnimation}`,
        }}
      >
        {/* Core sphere */}
        <div
          className="w-full h-full rounded-full relative overflow-hidden"
          style={{
            background: `radial-gradient(circle at 30% 30%,
              rgba(74, 144, 226, 0.9) 0%,
              rgba(0, 170, 255, 0.7) 40%,
              rgba(0, 255, 255, 0.5) 70%,
              rgba(74, 144, 226, 0.3) 100%)`,
            boxShadow: `
              0 0 ${20 * glowIntensity}px rgba(0, 170, 255, 0.6),
              0 0 ${40 * glowIntensity}px rgba(0, 255, 255, 0.4),
              0 0 ${60 * glowIntensity}px rgba(74, 144, 226, 0.3),
              inset 0 0 ${30 * glowIntensity}px rgba(255, 255, 255, 0.2)
            `,
            border: '2px solid rgba(0, 255, 255, 0.3)',
          }}
        >
          {/* Inner iris/pupil */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${sphereSize * 0.3}px`,
              height: `${sphereSize * 0.3}px`,
              background: `radial-gradient(circle,
                rgba(0, 255, 255, 0.9) 0%,
                rgba(0, 170, 255, 0.7) 50%,
                rgba(74, 144, 226, 0.5) 100%)`,
              boxShadow: `
                0 0 ${15 * glowIntensity}px rgba(0, 255, 255, 0.8),
                inset 0 0 ${10 * glowIntensity}px rgba(255, 255, 255, 0.3)
              `,
              animation: isPulsing ? 'holosphere-pulse 1s ease-in-out infinite' : 'none',
            }}
          />

          {/* Rotating outer ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-30"
            style={{
              animation: 'holosphere-rotate 10s linear infinite',
              borderStyle: 'dashed',
            }}
          />

          {/* Ripple effects */}
          {(isActive || isPulsing) && (
            <>
              <div
                className="absolute inset-0 rounded-full border-2 border-cyan-300 opacity-20"
                style={{
                  animation: 'holosphere-ripple 2s ease-out infinite',
                  animationDelay: '0s',
                }}
              />
              <div
                className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-15"
                style={{
                  animation: 'holosphere-ripple 2s ease-out infinite',
                  animationDelay: '0.5s',
                }}
              />
            </>
          )}

          {/* Surface distortion overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `repeating-conic-gradient(
                from 0deg at 50% 50%,
                transparent 0deg,
                rgba(0, 255, 255, 0.1) 10deg,
                transparent 20deg
              )`,
              animation: 'holosphere-rotate 20s linear infinite reverse',
            }}
          />
        </div>

        {/* Particle effects around the sphere */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * (sphereSize * 0.7);
          const y = Math.sin(angle) * (sphereSize * 0.7);

          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                animation: `holosphere-pulse ${2 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          );
        })}
      </div>

      {/* Status indicators */}
      {isListening && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm font-medium">
          Listening...
        </div>
      )}
      {isSpeaking && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-blue-400 text-sm font-medium">
          Speaking...
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react';

interface SphereMotionOptions {
  attractToPointer?: boolean;
  driftStrength?: number;
}

export function useSphereMotion(options: SphereMotionOptions = {}) {
  const { attractToPointer = false, driftStrength = 0.1 } = options;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (attractToPointer) {
        // Smooth mouse following with easing
        setMousePosition(prev => ({
          x: prev.x + (e.clientX - window.innerWidth + 100 - prev.x) * 0.1,
          y: prev.y + (e.clientY - window.innerHeight + 100 - prev.y) * 0.1
        }));
      } else {
        // Very subtle response to mouse movement
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (e.clientX - centerX) * driftStrength;
        const deltaY = (e.clientY - centerY) * driftStrength;
        
        setMousePosition({ x: deltaX, y: deltaY });
      }
    };

    const smoothUpdate = () => {
      // Continuous smooth updates
      animationId = requestAnimationFrame(smoothUpdate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationId = requestAnimationFrame(smoothUpdate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [attractToPointer, driftStrength]);

  return {
    mouseX: mousePosition.x,
    mouseY: mousePosition.y,
    isDragging
  };
}

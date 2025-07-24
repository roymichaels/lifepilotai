import { useState, useEffect } from 'react';

export function useSpherePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Smooth sinusoidal movement
      const x = Math.sin(elapsed * 0.0005) * 3; // Very subtle horizontal drift
      const y = Math.cos(elapsed * 0.0003) * 2; // Very subtle vertical drift

      setPosition({ x, y });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return position;
}

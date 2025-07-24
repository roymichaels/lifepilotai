import React, { useRef, useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';

interface LiquidMetalSphereProps {
  isActive?: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
  isPulsing?: boolean;
  size?: number;
  className?: string;
}

// Fallback component when Three.js fails to load
const FallbackSphere = ({
  isActive,
  isListening,
  isSpeaking,
  isPulsing,
  size = 1,
  className = ''
}: LiquidMetalSphereProps) => {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
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
};

export function LiquidMetalSphere(props: LiquidMetalSphereProps) {
  const { size = 1, className = '' } = props;
  const [threeReady, setThreeReady] = useState<boolean | null>(null);
  const CanvasRef = useRef<any>(null);
  const useFrameRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const fiber = await import('@react-three/fiber');
        if (!cancelled) {
          CanvasRef.current = fiber.Canvas;
          useFrameRef.current = fiber.useFrame;
          setThreeReady(true);
        }
      } catch (err) {
        console.error('Failed to load three.js', err);
        if (!cancelled) setThreeReady(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (threeReady !== true) {
    return <FallbackSphere {...props} />;
  }

  const Canvas = CanvasRef.current as React.ComponentType<any>;
  const useFrame = useFrameRef.current as any;

  const SphereMesh = () => {
    const mesh = useRef<any>(null);
    useFrame(() => {
      if (mesh.current && props.isActive) {
        mesh.current.rotation.y += 0.01;
      }
    });

    const scale = props.isSpeaking
      ? [1.1, 1.1, 1.1]
      : props.isPulsing
        ? [1.05, 1.05, 1.05]
        : [1, 1, 1];

    return (
      <mesh ref={mesh} scale={scale}>
        {/* @ts-ignore -- three types not guaranteed */}
        <sphereGeometry args={[1, 64, 64]} />
        {/* @ts-ignore -- three types not guaranteed */}
        <meshStandardMaterial metalness={1} roughness={0.2} color="silver" />
      </mesh>
    );
  };

  return (
    <Suspense fallback={<FallbackSphere {...props} />}>
      <Canvas
        className={className}
        style={{ width: `${size * 64}px`, height: `${size * 64}px` }}
      >
        {/* @ts-ignore -- three types not guaranteed */}
        <ambientLight intensity={0.5} />
        {/* @ts-ignore -- three types not guaranteed */}
        <pointLight position={[10, 10, 10]} />
        <SphereMesh />
      </Canvas>
    </Suspense>
  );
}

import React, { Suspense, useEffect, useRef, useState } from 'react'

export function GameWorld() {
  const [ready, setReady] = useState(false)
  const CanvasRef = useRef<any>(null)
  const useFrameRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const fiber = await import('@react-three/fiber')
        if (!cancelled) {
          CanvasRef.current = fiber.Canvas
          useFrameRef.current = fiber.useFrame
          setReady(true)
        }
      } catch (err) {
        console.error('Failed to load three.js', err)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return <div className="w-full h-full bg-black text-white flex items-center justify-center">Loading 3D...</div>
  }

  const Canvas = CanvasRef.current as React.ComponentType<any>
  const useFrame = useFrameRef.current as any

  const SpinningBox = () => {
    const mesh = useRef<any>(null)
    useFrame(() => {
      if (mesh.current) {
        mesh.current.rotation.x += 0.01
        mesh.current.rotation.y += 0.01
      }
    })
    return (
      <mesh ref={mesh}>
        {/* @ts-expect-error three types not guaranteed */}
        <boxGeometry args={[1, 1, 1]} />
        {/* @ts-expect-error three types not guaranteed */}
        <meshStandardMaterial color="orange" />
      </mesh>
    )
  }

  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      {/* @ts-expect-error -- three types not guaranteed */}
      <ambientLight intensity={0.5} />
      {/* @ts-expect-error -- three types not guaranteed */}
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <SpinningBox />
      </Suspense>
    </Canvas>
  )
}

export default GameWorld

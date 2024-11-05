'use client'

import { useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'

export default function Scroll() {
  const { scene: cloudScene } = useGLTF('/assets/background/cloud.glb')

  useEffect(() => {
    useGLTF.preload('/assets/background/cloud.glb')
  }, [])

  return (
    <section className="h-screen relative">
      <Canvas
        camera={{ position: [0, -20, 20], fov: 70 }}
        className="absolute top-0"
      >
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={5} color="#ffffff" />
        <primitive
          object={cloudScene.clone()}
          dispose={null}
          scale={[3, 3, 3]}
          position={[0, -10, -10]}
        />
      </Canvas>
    </section>
  )
}

'use client'

import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import { Canvas } from '@react-three/fiber'
import Image from 'next/image'

export default function Scroll() {
  return (
    <section className="h-screen relative">
      <>
        <Image
          src="/images/blinker-cloud.png"
          alt="blinker-cloud"
          height={330}
          width={260}
          className="absolute left-32 top-48 z-10"
        />
        <Image
          src="/images/helmet-cloud.png"
          alt="helmet-cloud"
          height={252}
          width={200}
          className="absolute right-20 bottom-10"
        />
      </>

      <Canvas
        camera={{ position: [0, -20, 20], fov: 70 }}
        className="absolute top-0"
      >
        <ambientLight intensity={2} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={5} color="#ffffff" />
        <ModelLoader
          path="/assets/background/cloud.glb"
          scale={[4, 4, 4]}
          position={[25, -25, -18]}
          rotation={[0, 0, 0]}
        />
      </Canvas>
    </section>
  )
}

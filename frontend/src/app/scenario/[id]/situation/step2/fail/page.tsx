'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import { useRouter } from 'next/navigation'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'

function Fail() {
  const router = useRouter()
  const [fireScale, setFireScale] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setFireScale((prev) => prev + 0.1)
    }, 500)

    setTimeout(() => {
      clearInterval(interval)
      router.push(`/scenario/result/host`)
    }, 6000)
  }, [])

  return (
    <StoryLayout
      speechText="으악 불이 더 커지고 있어! 불이 났을 때 바로 119에 신고해야 했는데......"
      isSpeechVisible
    >
      <div className="fixed inset-0">
        <Canvas
          camera={{
            position: [0, 2, 5],
            near: 0.1,
            far: 2000,
            fov: 75,
          }}
          shadows
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
          }}
        >
          <ambientLight intensity={1.3} color="#ffffff" />
          <directionalLight
            position={[5, 5, 5]}
            intensity={3}
            color="#ffffff"
          />
          <>
            <ModelLoader
              path="/assets/scenario/fire2.glb"
              position={[-2, -1, 0]}
              scale={[fireScale, fireScale, fireScale]}
              rotation={[0, 0.2, 0]}
            />
            <ModelLoader
              path="/assets/scenario/fire2.glb"
              position={[-1, -2, 0.9]}
              scale={[fireScale, fireScale, fireScale]}
              rotation={[0, 0.2, 0]}
            />
            <ModelLoader
              path="/assets/scenario/fire2.glb"
              position={[-2.5, -2, 0.9]}
              scale={[fireScale, fireScale, fireScale]}
              rotation={[0, 0.2, 0]}
            />
            <ModelLoader
              path="/assets/scenario/fire2.glb"
              position={[-3, -3, 1.5]}
              scale={[fireScale, fireScale, fireScale]}
              rotation={[0, 0.2, 0]}
            />
            <ModelLoader
              path="/assets/scenario/fire2.glb"
              position={[-2, -3, 1.5]}
              scale={[fireScale, fireScale, fireScale]}
              rotation={[0, 0.2, 0]}
            />
            <ModelLoader
              path="/assets/scenario/fire2.glb"
              position={[-0.5, -3, 1.5]}
              scale={[fireScale, fireScale, fireScale]}
              rotation={[0, 0.2, 0]}
            />
          </>

          <ARController>
            <ambientLight intensity={0.5} />
            <pointLight
              position={[0, 2, 0]}
              intensity={2}
              color="#ff7700"
              distance={10}
              decay={2}
            />
            <spotLight
              position={[0, 5, 2]}
              angle={0.5}
              penumbra={0.5}
              intensity={1}
              castShadow
            />
          </ARController>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(Fail), { ssr: false })

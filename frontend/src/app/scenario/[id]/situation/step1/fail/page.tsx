/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'

function Step1Fail() {
  const router = useRouter()
  const { user } = useUser()
  const [fireScale, setFireScale] = useState(8)

  useEffect(() => {
    const interval = setInterval(() => {
      setFireScale((prev) => prev + 0.1)
    }, 500)

    setTimeout(() => {
      clearInterval(interval)

      router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
    }, 6000)
  }, [])

  return (
    <StoryLayout
      speechText={
        '으악 불이 더 커지고 있어!\n 그 물건은 불을 끄는 데 전혀 도움이 되지 않은 것 같아!'
      }
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
          <ARController>
            <ambientLight intensity={0.5} />
            <pointLight
              position={[0, 2, 0]}
              intensity={2}
              color="#ffffff"
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

            <Suspense fallback={null}>
              <>
                <ModelLoader
                  path="/assets/scenario/fire.glb"
                  position={[-30, -1, -10]}
                  scale={[fireScale, fireScale, fireScale]}
                />
                <ModelLoader
                  path="/assets/scenario/fire.glb"
                  position={[-26, -1, -10]}
                  scale={[fireScale, fireScale, fireScale]}
                />
                <ModelLoader
                  path="/assets/scenario/fire.glb"
                  position={[-24, -1, -10]}
                  scale={[fireScale, fireScale, fireScale]}
                />
                <ModelLoader
                  path="/assets/scenario/fire.glb"
                  position={[-30, -1, -10]}
                  scale={[fireScale, fireScale, fireScale]}
                />
                <ModelLoader
                  path="/assets/scenario/fire.glb"
                  position={[-20, -1, -10]}
                  scale={[fireScale, fireScale, fireScale]}
                />
              </>
            </Suspense>
          </ARController>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(Step1Fail), {
  ssr: false,
})

'use client'

import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import { Suspense, useEffect } from 'react'

function SituationStep2() {
  const speechText =
    '이번에는 불이 엄청 크게 붙었네. 내가 끌 수 없을 것 같아.  어떻게 해야 할까?'

  useEffect(() => {
    localStorage.setItem('stageNumber', '2')
  }, [])

  return (
    <StoryLayout speechText={speechText} isSpeechVisible showNextButton>
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
                path="/assets/scenario/fire2.glb"
                position={[-2, -1, 0]}
                scale={[7, 7.5, 7]}
                rotation={[0, 0.2, 0]}
              />
              <ModelLoader
                path="/assets/scenario/fire2.glb"
                position={[-1, -2, 0.9]}
                scale={[7, 7.5, 7]}
                rotation={[0, 0.2, 0]}
              />
              <ModelLoader
                path="/assets/scenario/fire2.glb"
                position={[-2.5, -2, 0.9]}
                scale={[7.5, 7.5, 7.5]}
                rotation={[0, 0.2, 0]}
              />
              <ModelLoader
                path="/assets/scenario/fire2.glb"
                position={[-3, -3, 1.5]}
                scale={[7, 7, 7]}
                rotation={[0, 0.2, 0]}
              />
              <ModelLoader
                path="/assets/scenario/fire2.glb"
                position={[-2, -3, 1.5]}
                scale={[7, 7, 7]}
                rotation={[0, 0.2, 0]}
              />
              <ModelLoader
                path="/assets/scenario/fire2.glb"
                position={[-0.5, -3, 1.5]}
                scale={[7.5, 7.5, 7.5]}
                rotation={[0, 0.2, 0]}
              />
            </>
          </Suspense>
        </ARController>
      </Canvas>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(SituationStep2), { ssr: false })

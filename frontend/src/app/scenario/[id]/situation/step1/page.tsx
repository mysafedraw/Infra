/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'

function SituationStep1() {
  return (
    <StoryLayout
      speechText={
        '헉 저기에 불이 붙었어! \n 초기에 빨리 진압해야 할 텐데... 지금 필요한 건'
      }
      isSpeechVisible
      showNextButton
    >
      <div className="fixed inset-0">
        <Canvas
          camera={{
            position: [0, 0, 0],
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
              <ModelLoader
                path="/assets/scenario/fire.glb"
                position={[-26, -1, -10]}
                scale={[8, 8, 8]}
              />
              <ModelLoader
                path="/assets/scenario/fire.glb"
                position={[-24, -1, -10]}
                scale={[8, 8, 8]}
              />
              <ModelLoader
                path="/assets/scenario/fire.glb"
                position={[-25, -1, -10]}
                scale={[8, 8, 8]}
              />
            </Suspense>
          </ARController>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(SituationStep1), { ssr: false })

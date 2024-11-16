/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import SmokeModel from '@/app/scenario/[id]/situation/components/SmokeModel'
import ActionScene from '@/app/scenario/[id]/situation/components/ActionScene'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'

function Step3() {
  useEffect(() => {
    localStorage.setItem('stageNumber', '4')
  }, [])
  return (
    <StoryLayout
      speechText={'화재 현장은 너무 위험해! 어서 대피하자!! 어디로 가야 하지?'}
      isSpeechVisible
      showNextButton
    >
      <div className="fixed inset-0">
        <Canvas
          camera={{
            position: [0, 0, 5],
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

            {/* 연기 */}
            <Suspense fallback={null}>
              <SmokeModel position={[0, -1, 0]} />
              <SmokeModel position={[-1, -0.5, 0]} />
              <SmokeModel position={[-0.5, 0, 0]} />
            </Suspense>
          </ARController>
          <ActionScene>
            <ModelLoader
              path="/assets/scenario/stairs.glb"
              position={[-2.8, -0.5, 0]}
              scale={[1, 1, 1]}
              rotation={[0, 1.4, 0]}
            />

            <ModelLoader
              path="/assets/scenario/elevator.glb"
              position={[2.5, 1, 0]}
              scale={[0.01, 0.01, 0.01]}
              rotation={[0, -0.4, 0]}
            />
            {/* 화살표 */}
            <ModelLoader
              path="/assets/scenario/arrow-animation.glb"
              position={[-3, 2.2, 0]}
              scale={[0.25, 0.25, 0.25]}
              rotation={[0, 0, 0]}
            />
            <ModelLoader
              path="/assets/scenario/arrow-animation.glb"
              position={[2.5, 2.3, 0]}
              scale={[0.25, 0.25, 0.25]}
              rotation={[0, 0, 0]}
            />
          </ActionScene>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(Step3), { ssr: false })

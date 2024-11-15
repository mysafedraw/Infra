/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Canvas, useLoader } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import SmokeModel from '@/app/scenario/[id]/situation/components/SmokeModel'

function Step3Fail() {
  return (
    <StoryLayout
      speechText={
        '연기는 계속 들어오는데 숨을 쉴 수가 수가 없어...\n나는 여기까지인 것 같아... 다음에는 꼭 탈출시켜줘😥'
      }
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
              <SmokeModel position={[-2, -2, -2]} />
              <SmokeModel position={[-1, -3, -1]} />
              <SmokeModel position={[-3, -2, -3]} />
              <SmokeModel position={[-4, -2, -3]} />
            </Suspense>
          </ARController>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(Step3Fail), { ssr: false })

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import ActionScene from '@/app/scenario/[id]/situation/components/ActionScene'
import SmokeModel from '@/app/scenario/[id]/situation/components/SmokeModel'

function Step3SucccessHandkerchief() {
  const [showGuide, setShowGuide] = useState(true)
  const [speechText, setSpeechText] = useState(
    '저기 계단을 통해 빨리 대피해보자!!',
  )
  const router = useRouter()
  const { user } = useUser()

  // 계단 이벤트
  const handleStairsClick = () => {
    setShowGuide(false)
    setSpeechText('다행이야!! 계단으로 대피해서 연기를 피할 수 있었어!!!')

    setTimeout(() => {
      setTimeout(() => {
        router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
      }, 6000)
    }, 500)
  }

  return (
    <StoryLayout speechText={speechText} isSpeechVisible>
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
              <>
                <SmokeModel position={[0, -1, 0]} />
                <SmokeModel position={[-1, -0.5, 0]} />
                <SmokeModel position={[-0.5, 0, 0]} />
              </>
            </Suspense>
          </ARController>
          {/* 상호 작용 */}
          <ActionScene>
            <>
              {/* 계단 */}
              <ModelLoader
                path="/assets/scenario/stairs.glb"
                position={[-2.8, -0.5, 0]}
                scale={[1, 1, 1]}
                rotation={[0, 1.4, 0]}
                onClick={handleStairsClick}
              />
            </>
            {showGuide && (
              <Html position={[-3, 0, 0]} style={{ pointerEvents: 'none' }}>
                <div className="relative flex justify-center items-center">
                  <div className="rounded-full border-[10px] border-dashed border-primary-500 w-96 h-96 absolute"></div>
                  <div className="rounded-full border-[10px] border-dashed border-primary-500 w-80 h-80 absolute"></div>
                  <p className="animate-bounce bg-primary-500 whitespace-nowrap py-5 px-8 text-2xl rounded-lg shadow-md absolute top-0 left-32">
                    계단을 눌러주세요
                  </p>
                </div>
              </Html>
            )}
          </ActionScene>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(Step3SucccessHandkerchief), {
  ssr: false,
})

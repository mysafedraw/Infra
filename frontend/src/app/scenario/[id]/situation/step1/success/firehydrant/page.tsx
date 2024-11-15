/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Html } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import ActionScene from '@/app/scenario/[id]/situation/components/ActionScene'

function Step1SucccessFirehydrant() {
  const [showFire, setShowFire] = useState(true)
  const [speechText, setSpeechText] = useState('소화기로 빨리 불을 꺼야해!')
  const router = useRouter()
  const { user } = useUser()

  // 소화기로 불 끄기
  const handlefirehydrantClick = () => {
    setShowFire(false)
    setSpeechText('야호! 무사히 불을 껐어!\n소화기 사용법도 잘 알아둬야겠군!')

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
              {showFire && (
                <>
                  <ModelLoader
                    path="/assets/scenario/fire2.glb"
                    position={[2, 3, 0]}
                    scale={[6, 6, 6]}
                  />
                  <ModelLoader
                    path="/assets/scenario/fire2.glb"
                    position={[4, 3, 0]}
                    scale={[6, 6, 6]}
                  />
                  <ModelLoader
                    path="/assets/scenario/fire2.glb"
                    position={[3, 3, 0]}
                    scale={[6, 6, 6]}
                  />
                </>
              )}
            </Suspense>
          </ARController>

          {/* 상호 작용 */}
          <ActionScene>
            {/* 소화기 */}
            <ModelLoader
              path="/assets/scenario/fire-hydrant.glb"
              position={[3, -2.2, 0]}
              scale={[0.12, 0.12, 0.12]}
              onClick={handlefirehydrantClick}
            />
            {showFire && (
              <Html position={[3, 0, 0]} style={{ pointerEvents: 'none' }}>
                <div className="relative flex justify-center items-center">
                  <div className="rounded-full border-[10px] border-dashed border-primary-500 w-96 h-96 absolute"></div>
                  <div className="rounded-full border-[10px] border-dashed border-primary-500 w-80 h-80 absolute"></div>
                  <p className="animate-bounce bg-primary-500 whitespace-nowrap py-5 px-8 text-2xl rounded-lg shadow-md absolute top-0 left-14">
                    소화기를 눌러주세요
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

export default dynamic(() => Promise.resolve(Step1SucccessFirehydrant), {
  ssr: false,
})

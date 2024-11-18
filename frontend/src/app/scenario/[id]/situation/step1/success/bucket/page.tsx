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
import FireModel from '@/app/scenario/[id]/situation/step1/components/FireModel'

function Step1SucccessBucket() {
  const [showFire, setShowFire] = useState(true)
  const [speechText, setSpeechText] = useState('물을 부어서 빨리 불을 꺼야해!')
  const router = useRouter()
  const { user } = useUser()

  // 물 양동이로 불 끄기
  const handleBucketClick = () => {
    setShowFire(false)
    setSpeechText('야호! 무사히 불을 껐어!\n역시 물 양동이가 있어서 다행이야!')

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
            <Suspense fallback={null}>{showFire && <FireModel />}</Suspense>
          </ARController>
          {/* 상호 작용 */}
          <ActionScene>
            {/* 양동이 */}
            <ModelLoader
              path="/assets/scenario/bucket.glb"
              position={[2.7, 0.2, 0]}
              scale={[0.07, 0.07, 0.07]}
              onClick={handleBucketClick}
            />
            {showFire && (
              <Html position={[3, 0.7, 0]} style={{ pointerEvents: 'none' }}>
                <div className="relative flex justify-center items-center">
                  <div className="rounded-full border-[10px] border-dashed border-primary-500 w-96 h-96 absolute"></div>
                  <div className="rounded-full border-[10px] border-dashed border-primary-500 w-80 h-80 absolute"></div>
                  <p className="animate-bounce bg-primary-500 whitespace-nowrap py-5 px-8 text-2xl rounded-lg shadow-md absolute -top-16 left-28">
                    양동이를 눌러주세요
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

export default dynamic(() => Promise.resolve(Step1SucccessBucket), {
  ssr: false,
})

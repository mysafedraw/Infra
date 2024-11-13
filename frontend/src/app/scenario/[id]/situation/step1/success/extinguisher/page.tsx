/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'

function Step1SucccessExtinguisher() {
  const [showFire, setShowFire] = useState(true)
  const [speechText, setSpeechText] = useState('소화기로 빨리 불을 꺼야해!')
  const router = useRouter()
  const { user } = useUser()

  // 소화기로 불 끄기 성공
  const handleExtinguisherClick = () => {
    setShowFire(false)
    setSpeechText('야호! 무사히 불을 껐어!\n소화기 사용법도 잘 알아둬야겠군!')

    // 성공 후 알림과 페이지 이동
    setTimeout(() => {
      alert('소화기를 이용해서 불이 꺼졌습니다!')
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
                    path="/assets/scenario/fire.glb"
                    position={[-30, -1, -10]}
                    scale={[8, 8, 8]}
                  />
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
                </>
              )}
            </Suspense>
          </ARController>
          <ModelLoader
            path="/assets/scenario/fire_extinguisher.glb"
            position={[12, 0, 0]}
            scale={[0.2, 0.2, 0.2]}
            onClick={handleExtinguisherClick}
          />
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(Step1SucccessExtinguisher), {
  ssr: false,
})

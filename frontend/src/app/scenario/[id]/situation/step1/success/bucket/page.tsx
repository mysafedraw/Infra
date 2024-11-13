/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'

function BucketScene() {
  const [showFire, setShowFire] = useState(true)
  const [speechText, setSpeechText] = useState('물을 부어서 빨리 불을 꺼야해!')
  const router = useRouter()
  const { user } = useUser()

  // 물 양동이로 불 끄기 성공
  const handleDragSuccess = () => {
    setShowFire(false)
    setSpeechText('야호! 무사히 불을 껐어!\n역시 물 양동이가 있어서 다행이야!')

    // 성공 후 알림과 페이지 이동
    setTimeout(() => {
      setTimeout(() => {
        router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
      }, 10000)
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
                  <ModelLoader
                    path="/assets/scenario/fire.glb"
                    position={[-25, -1, -10]}
                    scale={[8, 8, 8]}
                  />
                  <ModelLoader
                    path="/assets/scenario/fire.glb"
                    position={[-20, -1, -10]}
                    scale={[8, 8, 8]}
                  />
                </>
              )}
              {/* Draggable Bucket */}
              <ModelLoader
                path="/assets/scenario/bucket.glb"
                position={[15, 0, 0]}
                scale={[0.2, 0.2, 0.2]}
                onClick={handleDragSuccess}
              />
            </Suspense>
          </ARController>
        </Canvas>
        {/* 드래그 가이드 */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-orange-400 text-white px-6 py-3 rounded-full animate-bounce">
            불이 난 곳으로 물을 뿌려주세요
          </div>
        </div>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(BucketScene), { ssr: false })

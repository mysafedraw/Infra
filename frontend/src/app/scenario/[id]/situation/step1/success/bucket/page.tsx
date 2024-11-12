/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import Head from 'next/head'
import Image from 'next/image'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import CharacterDialogue from '@/app/scenario/[id]/situation/components/CharacterDialogue'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'

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
      alert('물을 부어서 불이 꺼졌습니다!')
      setTimeout(() => {
        router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
      }, 10000)
    }, 500)
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
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
              color="#ff7700"
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

        <div className="absolute inset-0 pointer-events-none">
          <div className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-row items-center">
              <Image
                src="/icons/back-arrow.svg"
                alt="back"
                width={60}
                height={60}
                className="h-12 w-auto cursor-pointer pointer-events-auto"
                onClick={() => router.back()}
              />
              <div className="bg-white border-primary-500 border-4 p-4 px-12 rounded-3xl ml-4">
                <h3 className="text-2xl font-bold">화재 시나리오</h3>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end">
              <CharacterDialogue speechText={speechText} />
            </div>
          </div>
        </div>

        {/* 드래그 가이드 */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-orange-400 text-white px-6 py-3 rounded-full animate-bounce">
            불이 난 곳으로 물을 뿌려주세요
          </div>
        </div>
      </div>
    </>
  )
}

export default dynamic(() => Promise.resolve(BucketScene), { ssr: false })

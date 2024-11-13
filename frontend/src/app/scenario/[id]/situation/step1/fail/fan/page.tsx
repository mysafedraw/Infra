/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import Head from 'next/head'
import Image from 'next/image'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import CharacterDialogue from '@/app/scenario/[id]/situation/components/CharacterDialogue'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'

function FanScene() {
  const [showFire, setShowFire] = useState(false)
  const [speechText, setSpeechText] = useState('선풍기로 불을 끌 수 있을까...?')
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    setTimeout(() => {
      setShowFire(true)
      setSpeechText(
        '으악 선풍기를 틀었더니 불이 더 커지고 있어!! 우린 다 죽을거야!!',
      )

      //   setTimeout(() => {
      //     router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
      //   }, 10000)
    }, 5000)
  }, [])

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

            {/* 선풍기만 밝게 비추는 조명 */}
            <directionalLight
              position={[1, 3, 3]}
              intensity={3}
              color="#ffffff"
              target-position={[0, 0, 0]} // 선풍기 위치에 맞게 조정
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
              {showFire && (
                <>
                  <ModelLoader
                    path="/assets/scenario/fire.glb"
                    position={[-30, -1, -10]}
                    scale={[8, 8, 8]}
                  />

                  <ModelLoader
                    path="/assets/scenario/fire.glb"
                    position={[-20, -1, -10]}
                    scale={[8, 8, 8]}
                  />
                </>
              )}
            </Suspense>
          </ARController>

          {/* 선풍기 모델 */}
          <ModelLoader
            path="/assets/scenario/fan.glb"
            position={[0, 0, 0]}
            scale={[0.4, 0.4, 0.4]}
            rotation={[0, Math.PI, 0]}
          />

          {/* 추가 모델 */}
          <ModelLoader
            path="/assets/scenario/medical_mask.glb"
            position={[3, 1, 0]}
            scale={[10, 10, 10]}
            rotation={[-0.5, Math.PI - 0.5, 0.1]}
          />
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
      </div>
    </>
  )
}

export default dynamic(() => Promise.resolve(FanScene), { ssr: false })

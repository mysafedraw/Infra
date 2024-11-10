/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import Head from 'next/head'
import Image from 'next/image'
import ARController from '@/app/scenario/components/ARController'
import ModelLoader from '@/app/scenario/components/ModelLoader'
import CharacterDialogue from '@/app/scenario/components/CharacterDialogue'
import { useRouter } from 'next/navigation'

function Situation() {
  const [showFire] = useState(true)
  const [speechText] = useState('헉 불이 났어!\n물을 부어서 빨리 불을 꺼야해!')
  const router = useRouter()

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
            </Suspense>
          </ARController>
        </Canvas>

        <div className="absolute inset-0 pointer-events-none">
          <div className="flex flex-row items-center p-4">
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
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end">
              <CharacterDialogue speechText={speechText} />
            </div>
          </div>
        </div>

        {/* 드래그 가이드 */}
        <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="bg-orange-400 text-white px-6 py-3 rounded-full mb-3 cursor-pointer"
            onClick={() => {}}
          >
            소화기
          </div>
          <div
            className="bg-orange-400 text-white px-6 py-3 rounded-full cursor-pointer"
            onClick={() => {}}
          >
            양동이
          </div>
        </div>
      </div>
    </>
  )
}

export default dynamic(() => Promise.resolve(Situation), { ssr: false })

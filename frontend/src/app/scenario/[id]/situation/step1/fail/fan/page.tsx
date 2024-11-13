/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import Head from 'next/head'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import CharacterDialogue from '@/app/scenario/[id]/situation/components/CharacterDialogue'
import SituationHeader from '@/app/scenario/[id]/situation/components/SituationHeader'

function FanScene() {
  const [showFire, setShowFire] = useState(false)
  const [speechText, setSpeechText] = useState('선풍기로 불을 끌 수 있을까...?')

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
            <ambientLight intensity={1} />
            <directionalLight
              position={[1, 3, 3]}
              intensity={4}
              color="#ffffff"
            />
            <pointLight
              position={[3, 2, 1]}
              intensity={3}
              color="#ffffff"
              distance={8}
            />
            <spotLight
              position={[2, 3, 2]}
              angle={0.6}
              penumbra={0.3}
              intensity={2.5}
              color="#ffffff"
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
          <group>
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[1, 3, 3]}
              intensity={2}
              color="#ffffff"
            />
            <pointLight
              position={[3, 2, 1]}
              intensity={2}
              color="#ffffff"
              distance={8}
            />
            <spotLight
              position={[2, 3, 2]}
              angle={0.6}
              penumbra={0.3}
              intensity={2.5}
              color="#ffffff"
            />

            {/* 선풍기 모델 */}
            <ModelLoader
              path="/assets/scenario/fan.glb"
              position={[3, 0, 0]}
              scale={[0.4, 0.4, 0.4]}
              rotation={[0, Math.PI - 1.5, -0.3]}
            />
          </group>
        </Canvas>

        <div className="absolute inset-0 pointer-events-none">
          <SituationHeader title="화재 시나리오" />
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

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
import { useRouter } from 'next/navigation'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import ScenarioHeader from '@/app/scenario/[id]/situation/components/SituationHeader'
import { useUser } from '@/app/_contexts/UserContext'

interface DrawStartResponse {
  action: 'DRAWING_START'
  endTime: number
  timeLimit: number
}

function SituationStep1() {
  const [showFire] = useState(true)
  const [speechText] = useState(
    '헉 저기에 불이 붙었어! \n 초기에 빨리 진압해야 할 텐데... 지금 필요한 건',
  )
  const router = useRouter()
  const { client, isConnected, sendMessage, registerCallback } =
    useWebSocketContext()
  const [roomId, setRoomId] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  // 그림 그리기 이동
  const handleMoveDraw = () => {
    if (!client || !isConnected) return

    sendMessage(`/games/drawing/start`, JSON.stringify({ roomId }))
  }

  // 그림 그리기 시작 응답 처리
  const handleDrawingStartResponse = (response: DrawStartResponse) => {
    console.log(response)
    router.push('/scenario/1/draw')
    localStorage.setItem('endTime', String(response.endTime))
    localStorage.setItem('timeLimit', String(response.timeLimit))
  }

  useEffect(() => {
    if (isConnected) {
      registerCallback(
        `/games/${roomId}`,
        'DRAWING_START',
        handleDrawingStartResponse,
      )
    }
  }, [isConnected, handleMoveDraw, handleDrawingStartResponse])

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
          <ScenarioHeader
            title="화재 시나리오"
            showNextButton={!!user?.isHost}
            onNext={handleMoveDraw}
          />
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

export default dynamic(() => Promise.resolve(SituationStep1), { ssr: false })

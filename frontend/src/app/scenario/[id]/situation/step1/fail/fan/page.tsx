/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client'

import { useState, Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'
import ActionScene from '@/app/scenario/[id]/situation/components/ActionScene'
import FireModel from '@/app/scenario/[id]/situation/step1/components/FireModel'

function Step1FailFan() {
  const router = useRouter()
  const { user } = useUser()
  const [speechText, setSpeechText] = useState('선풍기로 불을 끌 수 있을까...?')
  const [fireScale, setFireScale] = useState(6)
  const [showMoreFire, setShowMoreFire] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setFireScale((prev) => prev + 0.1)
      setShowMoreFire(true)
      setSpeechText(
        '으악 선풍기를 틀었더니 불이 더 커지고 있어!! 우린 다 죽을거야!!',
      )

      setTimeout(() => {
        router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
      }, 6000)
    }, 6000)
  }, [])

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
              <>
                <FireModel scale={[fireScale, fireScale,fireScale]}/>
                {showMoreFire && (
                  <>
                    <ModelLoader
                      path="/assets/scenario/fire2.glb"
                      position={[2, 3, 0]}
                      scale={[fireScale, fireScale, fireScale]}
                    />
                    <ModelLoader
                      path="/assets/scenario/fire2.glb"
                      position={[3, 3, 0]}
                      scale={[fireScale, fireScale, fireScale]}
                    />
                  </>
                )}
              </FireM>
            </Suspense>
          </ARController>
          {/* 상호 작용 */}
          <ActionScene>
            {/* 선풍기 */}
            <ModelLoader
              path="/assets/scenario/fan.glb"
              position={[3, 0, 0]}
              scale={[0.4, 0.4, 0.4]}
              rotation={[0, Math.PI - 1.5, -0.3]}
            />
          </ActionScene>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(Step1FailFan), { ssr: false })

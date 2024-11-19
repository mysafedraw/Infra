'use client'

import { Canvas } from '@react-three/fiber'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import { Html } from '@react-three/drei'
import { useEffect, useState } from 'react'
import SmokeModel from '../../../components/SmokeModel'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'

export default function FailSituation() {
  const router = useRouter()
  const { user } = useUser()
  const [speechText, setSpeechText] = useState(
    '엇 엘리베이터가 왔다. 빨리 타보자.',
  )
  const [boardingState, setBoardingState] = useState(false)
  const [warningStep, setWarningStep] = useState(1)
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  useEffect(() => {
    if (user?.avatarImg) {
      const match = user.avatarImg.match(/\/([^/]+)\.png$/)
      if (match) {
        if (match[1] === 'cat' || match[1] === 'fox') {
          setAvatarUrl(`/assets/scenario/unicorn-sick.glb`)
        } else {
          setAvatarUrl(`/assets/scenario/${match[1]}.glb`)
        }
      }
    }
  }, [user])

  const handleClickElevator = () => {
    if (boardingState) return
    setBoardingState(true)
    setSpeechText('이제 화재 현장을 빠져나갈 수 있겠지..?')
  }

  useEffect(() => {
    if (boardingState) {
      setTimeout(() => {
        setSpeechText('엇? 엘리베이터가 멈췄어. 무슨 일이지? 너무 무서워...')
        setTimeout(() => {
          setWarningStep(2)
        }, 2000)
      }, 3000)
    }
  }, [boardingState])

  useEffect(() => {
    if (warningStep === 2) {
      setSpeechText(
        '연기는 계속 들어오는데 엘리베이터가 멈춰서 탈출할 수가 없어... 나는 여기까지인 것같아... 다음에는 꼭 탈출시켜줘...',
      )

      setTimeout(() => {
        router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
      }, 6000)
    }
  }, [warningStep])

  return (
    <StoryLayout speechText={speechText} isSpeechVisible>
      <Canvas
        camera={{
          position: [0, 0, 5],
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
        <ambientLight intensity={2} color="#ffffff" />
        <directionalLight
          castShadow
          position={[0, 30, 0]}
          intensity={4}
          color="#ffffff"
        />
        <>
          {!boardingState ? (
            <Html position={[0, 1, 0]} style={{ pointerEvents: 'none' }}>
              <div className="relative flex justify-center items-center">
                <div className="rounded-full border-[10px] border-dashed border-primary-500 w-96 h-96 absolute"></div>
                <div className="rounded-full border-[10px] border-dashed border-primary-500 w-80 h-80 absolute"></div>
                <p className="bg-primary-500 whitespace-nowrap py-5 px-8 text-2xl rounded-lg shadow-md absolute top-0 left-0">
                  엘리베이터를 클릭해서 탑승해주세요.
                </p>
              </div>
            </Html>
          ) : (
            <ModelLoader
              path={avatarUrl}
              position={[0, -1.5, 0]}
              scale={[0.02, 0.02, 0.02]}
              rotation={[0, 0, 0]}
              animation={{
                timeScale: 1,
                loop: 0,
              }}
            />
          )}
          <ModelLoader
            path="/assets/scenario/elevator.glb"
            position={[0, 2.2, 0]}
            scale={[0.02, 0.02, 0.02]}
            rotation={[0, 0, 0]}
            animation={{
              timeScale: 1,
              loop: 0,
            }}
            onClick={handleClickElevator}
          />
          <SmokeModel position={[0, 1, 3]} />
          <SmokeModel position={[0, 1, 3]} />
          <SmokeModel position={[0, 1, 3]} />
          {warningStep === 2 ? (
            <>
              <SmokeModel position={[0, 1, 3]} />
              <SmokeModel position={[0, 1, 3]} />
              <SmokeModel position={[0, 1, 3]} />
            </>
          ) : null}
        </>
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
        </ARController>
      </Canvas>
    </StoryLayout>
  )
}

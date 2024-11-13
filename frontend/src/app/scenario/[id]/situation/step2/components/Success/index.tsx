'use client'

import { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import { AnimationMixer, LoopOnce } from 'three'
import SuccessStep2 from '@/app/scenario/[id]/situation/step2/components/SuccessStep2'
import { useRouter } from 'next/navigation'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import { ReportingState } from '../../success/page'
import { useUser } from '@/app/_contexts/UserContext'

export default function Step2({
  reportingState,
  currentAnimationIndex,
  setCurrentAnimationIndex,
  setSpeech,
}: {
  reportingState: ReportingState
  currentAnimationIndex: number
  setCurrentAnimationIndex: React.Dispatch<React.SetStateAction<number>>
  setSpeech: React.Dispatch<React.SetStateAction<string>>
}) {
  const router = useRouter()
  const phoneUrl = '/assets/scenario/phone.glb'
  const { scene: phoneScene, animations } = useGLTF(phoneUrl)
  const mixer = useRef<AnimationMixer | null>(null)
  const [isFire, setIsFire] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    if (phoneScene && animations.length) {
      mixer.current = new AnimationMixer(phoneScene)
    }

    return () => {
      mixer.current = null
    }
  }, [phoneScene, animations])

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta)
  })

  const handleClickPhone = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentAnimationIndex >= animations.length) return

    if (mixer.current) {
      const action = mixer.current.clipAction(animations[currentAnimationIndex])
      action.loop = LoopOnce
      action.clampWhenFinished = true

      action.reset().play()

      setCurrentAnimationIndex((prev) => prev + 1)
    }
  }

  useEffect(() => {
    if (!isFire) {
      setSpeech(`와 소방차가 불을 꺼줬어!! 다행이야!!`)
      setTimeout(() => {
        router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
      }, 6000)
    }
  }, [isFire])

  return (
    <>
      {isFire ? (
        <>
          <ModelLoader
            path="/assets/scenario/fire2.glb"
            position={[-2, -1, 0]}
            scale={[5, 5.5, 5]}
            rotation={[0, 0.2, 0]}
            onClick={() => setIsFire(false)}
          />
          <ModelLoader
            path="/assets/scenario/fire2.glb"
            position={[-1, -2, 0.9]}
            scale={[5, 5.5, 5]}
            rotation={[0, 0.2, 0]}
            onClick={() => setIsFire(false)}
          />
          <ModelLoader
            path="/assets/scenario/fire2.glb"
            position={[-2.5, -2, 0.9]}
            scale={[5.5, 5.5, 5.5]}
            rotation={[0, 0.2, 0]}
            onClick={() => setIsFire(false)}
          />
          <ModelLoader
            path="/assets/scenario/fire2.glb"
            position={[-3, -3, 1.5]}
            scale={[5, 5, 5]}
            rotation={[0, 0.2, 0]}
            onClick={() => setIsFire(false)}
          />
          <ModelLoader
            path="/assets/scenario/fire2.glb"
            position={[-2, -3, 1.5]}
            scale={[5, 5, 5]}
            rotation={[0, 0.2, 0]}
            onClick={() => setIsFire(false)}
          />
          <ModelLoader
            path="/assets/scenario/fire2.glb"
            position={[-0.5, -3, 1.5]}
            scale={[5.5, 5.5, 5.5]}
            rotation={[0, 0.2, 0]}
            onClick={() => setIsFire(false)}
          />
        </>
      ) : null}
      {reportingState === 'complete' ? (
        <SuccessStep2 />
      ) : (
        <>
          <primitive
            object={phoneScene}
            dispose={null}
            scale={[45, 45, 45]}
            position={[2.5, 0, 0]}
            rotation={[-0.4, 0, 0.3]}
            onClick={handleClickPhone}
          />
          {currentAnimationIndex <= 0 ? (
            <Html position={[3, 0, 0]} style={{ pointerEvents: 'none' }}>
              <div className="relative flex justify-center items-center">
                <div className="rounded-full border-[10px] border-dashed border-primary-500 w-96 h-96 absolute"></div>
                <div className="rounded-full border-[10px] border-dashed border-primary-500 w-80 h-80 absolute"></div>
                <p className="bg-primary-500 whitespace-nowrap py-5 px-8 text-2xl rounded-lg shadow-md absolute top-0 left-0">
                  핸드폰에 번호를 눌러주세요
                </p>
              </div>
            </Html>
          ) : null}
        </>
      )}
    </>
  )
}

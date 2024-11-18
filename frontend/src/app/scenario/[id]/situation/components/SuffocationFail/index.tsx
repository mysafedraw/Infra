'use client'

import { Canvas } from '@react-three/fiber'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import { Suspense, useEffect, useState } from 'react'
import SmokeModel from '@/app/scenario/[id]/situation/components/SmokeModel'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/_contexts/UserContext'
import ActionScene from '@/app/scenario/[id]/situation/components/ActionScene'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'

export default function SuffocationFail() {
  const router = useRouter()
  const { user } = useUser()
  const [showMoreSmoke, setShowMoreSmoke] = useState(false)

  const [avatarUrl, setAvatarUrl] = useState<string>('')

  useEffect(() => {
    if (user?.avatarImg) {
      const match = user.avatarImg.match(/\/([^/]+)\.png$/)
      console.log(match)
      if (match) {
        if (match[1] === 'cat' || match[1] === 'fox') {
          setAvatarUrl(`/assets/scenario/unicorn-sick.glb`)
        } else {
          setAvatarUrl(`/assets/scenario/${match[1]}-sick.glb`)
        }
      }
    }
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMoreSmoke(true)
    }, 500)

    setTimeout(() => {
      clearInterval(interval)

      router.push(`/scenario/result/${user?.isHost ? 'host' : 'participant'}`)
    }, 6000)
  }, [])

  return (
    <StoryLayout
      speechText={
        '연기는 계속 들어오는데 숨을 쉴 수가 수가 없어...\n나는 여기까지인 것 같아... 다음에는 꼭 탈출시켜줘😥'
      }
      isSpeechVisible
      showNextButton
    >
      <div className="fixed inset-0">
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
            {/* 연기 */}
            <Suspense fallback={null}>
              <SmokeModel position={[0, -1, 0]} />
              <SmokeModel position={[-1, -0.5, 0]} />
              <SmokeModel position={[-0.5, 0, 0]} />
              {showMoreSmoke && (
                <>
                  <SmokeModel position={[1, -1, 0]} />
                  <SmokeModel position={[0.5, 1, 0]} />
                </>
              )}
            </Suspense>
          </ARController>
          <ActionScene>
            <ModelLoader
              path={avatarUrl}
              position={[1, -0.5, 0]}
              scale={[0.025, 0.025, 0.025]}
              rotation={[-0.2, 0.2, 0]}
            />
          </ActionScene>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

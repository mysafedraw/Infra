'use client'

import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useEffect } from 'react'

export default function SituationStep5() {
  const speechText = '앗! 친구가 연기를 마셨는지 힘들어해요! 어떡하지?'

  useEffect(() => {
    localStorage.setItem('stageNumber', '5')
  }, [])

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

          <>
            <ModelLoader
              path="/assets/scenario/penguin-sick.glb"
              position={[1.5, -1, 0]}
              scale={[0.03, 0.03, 0.03]}
              rotation={[-0.2, 0.2, 0]}
            />
            <Html
              position={[1, 1.5, 0]}
              transform
              style={{
                pointerEvents: 'none',
              }}
            >
              <p className="bg-[rgba(124,124,124,0.5)] opacity-70 py-3 px-10 whitespace-nowrap text-2xl rounded-full text-gray-800">
                켁켁...
              </p>
            </Html>
          </>
        </ARController>
      </Canvas>
    </StoryLayout>
  )
}

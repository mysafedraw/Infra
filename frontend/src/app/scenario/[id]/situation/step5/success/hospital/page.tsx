'use client'

import { Canvas } from '@react-three/fiber'
import StoryLayout from '@/app/scenario/[id]/situation/components/StoryLayout'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'
import ARController from '@/app/scenario/[id]/situation/components/ARController'
import { useState } from 'react'
import { Html } from '@react-three/drei'

type PenguinState = 'sick' | 'healthy'

export default function HospitalScene() {
  const [speechText, setSpeechText] = useState(
    '내가 병원에 빨리 데려다줘서 친구가 살 수 있을 것 같아!!',
  )
  const [penguinState, setPenguinState] = useState<PenguinState>('sick')

  const handleClickHospital = () => {
    setPenguinState('healthy')
    setSpeechText('와 병원에서 치료를 받아서 내 친구 펭펭이가 살아났어!')
  }

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

        <ModelLoader
          path={
            penguinState === 'sick'
              ? '/assets/scenario/penguin-sick.glb'
              : '/assets/character/penguin.glb'
          }
          position={[-1, -1, 0]}
          scale={[0.025, 0.025, 0.025]}
          rotation={[-0.5, 0.5, 0]}
        />
        <>
          <ModelLoader
            path="/assets/scenario/hospital.glb"
            position={[2, 1, 0]}
            scale={[0.0027, 0.0027, 0.0027]}
            rotation={[0.2, -2.1, -0.1]}
            onClick={handleClickHospital}
          />
          {penguinState === 'sick' ? (
            <Html position={[2, 1, 0]} style={{ pointerEvents: 'none' }}>
              <div className="relative flex justify-center items-center">
                <div className="rounded-full border-[10px] border-dashed border-primary-500 w-96 h-96 absolute"></div>
                <div className="rounded-full border-[10px] border-dashed border-primary-500 w-80 h-80 absolute"></div>
                <p className="bg-primary-500 whitespace-nowrap py-5 px-8 text-2xl rounded-lg shadow-md absolute top-0 left-0">
                  병원을 클릭해주세요
                </p>
              </div>
            </Html>
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

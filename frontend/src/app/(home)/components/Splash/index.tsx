'use client'

import SafeIcon from '/public/icons/safe-word.svg'
import NoIcon from '/public/icons/no.svg'
import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Splash({
  setIsScroll,
}: {
  setIsScroll: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { scene: cloudScene } = useGLTF('/assets/background/cloud.glb')

  useEffect(() => {
    useGLTF.preload('/assets/background/cloud.glb')
    document.documentElement.classList.add('scrollbar-hide')

    return () => {
      document.documentElement.classList.remove('scrollbar-hide')
    }
  }, [])

  return (
    <section className="relative h-screen w-full">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 70 }}
        className="absolute top-0"
      >
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={5} color="#ffffff" />
        <primitive
          object={cloudScene.clone()}
          dispose={null}
          scale={[2, 2, 2]}
          position={[0, -10, -10]}
        />
      </Canvas>
      <div>
        <div className="flex flex-col justify-center items-center gap-28 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <h1 className="text-9xl text-text whitespace-nowrap select-none">
              내가 그린 기린 그림
            </h1>
            <span className="absolute -top-32 right-40" draggable="false">
              <SafeIcon />
            </span>
            <span className="absolute top-0 right-40" draggable="false">
              <NoIcon />
            </span>
          </div>
          <button
            className="bg-primary-600 text-white text-6xl py-7 rounded-xl border-[5px] border-primary-700 px-44 whitespace-nowrap select-none"
            onClick={() => setIsScroll(true)}
          >
            시작하기
          </button>
        </div>
      </div>
    </section>
  )
}

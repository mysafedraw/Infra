'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CharacterModel from '@/app/(home)/components/CharacterModel'

export default function UserNickname() {
  const router = useRouter()

  useEffect(() => {
    router.push('/nickname/set')
  }, [])

  return (
    <div className="fixed top-0 w-full h-screen inline-flex flex-col items-center justify-center pb-16 z-20 bg-secondary-500">
      <Canvas camera={{ position: [0, 0, 0], fov: 80 }}>
        <ambientLight intensity={1.3} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
        <OrbitControls
          enableZoom={false}
          enableRotate={false}
          minDistance={10}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 2.3}
        />
        <CharacterModel url="/assets/character/cat.glb" />
      </Canvas>
      {/* 닉네임 작성 여부에 따라 visible 설정 필요 */}
      <div className="flex flex-col gap-1 bg-primary-600 border-primary-700 border-[5px] text-white rounded-lg text-3xl w-full px-10 py-5 max-w-[60rem]">
        <p>알겠어. 나는 호돌이야!</p>
        <p>지금부터 안전에 대해서 배우러 안전 나라로 떠나보자~</p>
      </div>
    </div>
  )
}

'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Image from 'next/image'
import SignButton from '@/app/_components/SignButton'

const CHARACTER_LIST = [
  {
    id: 1,
    profile: '/images/character/tiger.png',
    name: '펭펭이',
    personality: ['활발', '친구조아', '메롱'],
    characterUrl: '/assets/character/penguin.glb',
  },
  {
    id: 2,
    profile: '/images/character/tiger.png',
    name: '돌돌이',
    personality: ['활발', '친구조아', '메롱'],
    characterUrl: '/assets/character/dog.glb',
  },
  {
    id: 3,
    profile: '/images/character/tiger.png',
    name: '유니코드',
    personality: ['활발', '친구조아', '메롱'],
    characterUrl: '/assets/character/unicorn.glb',
  },
  {
    id: 4,
    profile: '/images/character/tiger.png',
    name: '야옹이',
    personality: ['활발', '친구조아', '메롱'],
    characterUrl: '/assets/character/cat.glb',
  },
  {
    id: 5,
    profile: '/images/character/tiger.png',
    name: '호돌이',
    personality: ['활발', '친구조아', '메롱'],
    characterUrl: '/assets/character/dog.glb',
  },
]

export default function SelectCharcter() {
  const [selectedCharacter, setSelectedCharacter] = useState(1)
  const { scene: cloudScene } = useGLTF('/assets/background/cloud.glb')
  const { scene: characterScene } = useGLTF(
    CHARACTER_LIST[selectedCharacter].characterUrl,
  )

  useEffect(() => {
    useGLTF.preload('/assets/background/cloud.glb')
  }, [])

  return (
    <section className="h-screen relative">
      <Canvas camera={{ position: [0, -50, 20], fov: 70 }}>
        <primitive
          object={cloudScene}
          dispose={null}
          scale={[1, 1, 1]}
          position={[0, 5, 2]}
        />
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={5} color="#ffffff" />
        <OrbitControls enableZoom={true} minDistance={2} maxDistance={10} />
      </Canvas>
      <div className="flex flex-col items-center gap-8 py-9 px-14 h-screen absolute bottom-0 left-0 w-full">
        <span className="bg-wood text-5xl py-6 bg-orange-950 text-white px-14 whitespace-nowrap rounded-xl shadow-md select-none">
          너와 가장 비슷한 친구를 골라줘
        </span>
        <div
          className="flex w-full gap-11 justify-center"
          style={{ height: 'calc(100% - 7rem' }}
        >
          {/* 캐릭터 고르는 창 */}
          <div className="w-1/2 h-full bg-[rgba(256,256,256,0.8)] rounded-2xl py-10 px-10  ">
            <div className="flex flex-col gap-14 overflow-y-auto  h-full pr-4">
              {CHARACTER_LIST.map((character, index) => {
                return (
                  <div
                    key={character.id}
                    className="flex gap-6 items-center cursor-pointer select-none"
                    onClick={() => {
                      setSelectedCharacter(index)
                    }}
                  >
                    <p className="w-32 h-32 aspect-square overflow-hidden rounded-full bg-secondary-600 shadow-md shrink-0">
                      <Image
                        src={character.profile}
                        alt="character_profile"
                        width={125}
                        height={125}
                        draggable={false}
                      />
                    </p>
                    <div className="bg-white flex flex-col gap-3 justify-center shadow-md rounded-2xl px-7 py-5  w-full">
                      <span className="text-3xl">{character.name}</span>
                      <div className="flex gap-2 text-2xl text-gray-dark flex-wrap">
                        {character.personality.map((personality) => (
                          <span
                            key={personality}
                            className="whitespace-nowrap"
                          >{`#${personality}`}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* 선택된 캐릭터 뜨는 창 */}
          <div className="w-1/2 h-full pb-4">
            <div className="h-3/4">
              <Canvas camera={{ position: [0, 0, 0], fov: 80 }}>
                <ambientLight intensity={1.3} color="#ffffff" />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={3}
                  color="#ffffff"
                />
                <OrbitControls
                  enableZoom={true}
                  minDistance={10}
                  maxDistance={10}
                  maxPolarAngle={Math.PI / 2.3}
                  minPolarAngle={Math.PI / 2.3}
                />
                <primitive
                  object={characterScene}
                  dispose={null}
                  scale={[0.1, 0.1, 0.1]}
                  position={[0, -6, 0]}
                />
              </Canvas>
            </div>
            <div className="bg-primary-600 border-[5px] h-1/4 border-primary-700 py-6 flex justify-center items-center text-white rounded-lg relative">
              <div className="absolute -top-[117px] -right-6">
                <SignButton
                  content="선택완료"
                  onClick={() => console.log('캐릭터 선택 완료')}
                />
              </div>

              <p className="text-3xl leading-normal ">
                호돌이는 활발하고 친구가 많아. <br />
                항상 긍정적이고 밝은 성격이지.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

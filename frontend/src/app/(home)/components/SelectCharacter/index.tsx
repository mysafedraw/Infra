'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Image from 'next/image'
import SignButton from '@/app/_components/SignButton'
import Link from 'next/link'
import { Character } from '@/app/(home)/page'

interface CharacterDetail {
  assetImg: string
  feature: string
  name: string
  profileImg: string
}

const CHARACTER_ASSETS: Record<number, string> = {
  1: '/assets/character/dog.glb',
  2: '/assets/character/tiger.glb',
  3: '/assets/character/bunny.glb',
  4: '/assets/character/fox.glb',
  5: '/assets/character/penguin.glb',
  6: '/assets/character/unicorn.glb',
  7: '/assets/character/cat.glb',
}

export default function SelectCharcter({
  characters,
}: {
  characters: Character[]
}) {
  const [selectedCharacter, setSelectedCharacter] = useState(
    characters[0].id || 1,
  ) // id
  const [characterDetail, setCharacterDetail] = useState('')
  const { scene: cloudScene } = useGLTF('/assets/background/cloud.glb')
  const { scene: characterScene } = useGLTF(
    CHARACTER_ASSETS[
      characters.filter((c) => c.id === selectedCharacter)[0].id
    ],
  )

  const fetchCharacterDetail = async (
    characterId: number,
  ): Promise<CharacterDetail> => {
    const response = await fetch(
      `http://70.12.247.148:8080/api/avatars/${characterId}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch character detail')
    }

    const result = await response.json()
    return result.data
  }

  useEffect(() => {
    const updateCharacterDetail = async () => {
      try {
        const detail = await fetchCharacterDetail(selectedCharacter)
        setCharacterDetail(detail.feature)
      } catch (error) {
        console.error('Failed to fetch character detail:', error)
      }
    }

    updateCharacterDetail()
  }, [selectedCharacter])

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
              {characters.map((character) => {
                return (
                  <div
                    key={character.id}
                    className="flex gap-6 items-center cursor-pointer select-none"
                    onClick={() => {
                      setSelectedCharacter(character.id)
                    }}
                  >
                    <p className="w-32 h-32 aspect-square overflow-hidden rounded-full bg-secondary-600 shadow-md shrink-0">
                      <Image
                        src={character.profileImg}
                        alt="character-profile"
                        width={125}
                        height={125}
                        draggable={false}
                      />
                    </p>
                    <div className="bg-white flex flex-col gap-3 justify-center shadow-md rounded-2xl px-7 py-5  w-full">
                      <span className="text-3xl">{character.avatarName}</span>
                      <div className="flex gap-2 text-2xl text-gray-dark flex-wrap">
                        {character.hashTagNameList.map((tag) => (
                          <span
                            key={tag}
                            className="whitespace-nowrap"
                          >{`#${tag}`}</span>
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
            <div className="bg-primary-600 border-[5px] h-1/4 border-primary-700 flex justify-center items-start text-white rounded-lg relative">
              <div className="absolute -top-[117px] -right-6 z-50">
                <Link href={'/nickname'}>
                  <SignButton
                    content="선택완료"
                    onClick={() => console.log('캐릭터 선택 완료')}
                  />
                </Link>
              </div>

              <p className="flex text-3xl leading-normal px-4 w-full overflow-y-auto h-full scrollbar-hide items-start">
                {characterDetail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

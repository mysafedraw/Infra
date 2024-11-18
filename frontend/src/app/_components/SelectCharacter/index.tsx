'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Character } from '@/app/(home)/page'
import { User, useUser } from '@/app/_contexts/UserContext'
import { useRouter } from 'next/navigation'
import CharacterList from '@/app/(home)/components/CharacterList'
import Link from 'next/link'
import SignButton from '@/app/_components/SignButton'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'

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

export default function SelectCharacter({
  characters,
  existAvartarId,
  background = false,
  path,
}: {
  characters: Character[]
  existAvartarId?: number
  background?: boolean
  path?: string
}) {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState(
    characters[0] ? characters[0].id : 1,
  )
  const [characterDetail, setCharacterDetail] = useState('')
  const { user, setUser } = useUser()

  const fetchCharacterDetail = async (
    characterId: number,
  ): Promise<CharacterDetail> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/avatars/${characterId}`,
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

  const postUserCharacter = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/avatars`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            userId: user?.userId,
            avatarId: selectedCharacter,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to post avatar')
      }

      const result = await response.json()

      return result.data
    } catch (error) {
      console.error('Error post avatar:', error)
      return null
    }
  }

  const handleClickSelectButton = async () => {
    if (path === 'setting') {
      const editedUser = await postUserCharacter()

      if (editedUser) {
        setUser({
          ...user,
          avatarId: selectedCharacter,
          avatarImg: editedUser.avatarsImg,
        } as User)
        router.back()
      } else {
        alert('캐릭터 변경에 실패했습니다.')
      }
    } else {
      setUser({
        nickname: '',
        avatarId: selectedCharacter,
      })
      router.push('/nickname')
    }
  }

  const CharacterCanvas = () => (
    <Canvas camera={{ position: [0, 0, 0], fov: 80 }}>
      <ambientLight intensity={1.3} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <OrbitControls
        enableZoom={true}
        minDistance={10}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 2.3}
      />
      <ModelLoader
        path={CHARACTER_ASSETS[selectedCharacter]}
        scale={[0.1, 0.1, 0.1]}
        position={[0, -6, 0]}
      />
    </Canvas>
  )

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
    if (existAvartarId) {
      setSelectedCharacter(existAvartarId)
    }
  }, [existAvartarId])

  return (
    <section
      className={`h-screen relative ${background ? 'bg-secondary-500' : null}`}
    >
      <Canvas camera={{ position: [0, -50, 20], fov: 70 }}>
        <ambientLight intensity={2} color="#ffffff" />
        <directionalLight
          castShadow
          position={[0, 30, 0]}
          intensity={4}
          color="#ffffff"
        />
        <ModelLoader
          path="/assets/background/cloud.glb"
          scale={[1, 1, 1]}
          position={[0, 5, 2]}
        />
        <ModelLoader
          path="/assets/background/background-map.glb"
          scale={[1, 1, 1]}
          rotation={[1.1, 1.2, 0]}
          position={[0, -1, -3]}
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
          {/* 캐릭터 리스트 */}
          <CharacterList
            characters={characters}
            setSelectedCharacter={setSelectedCharacter}
          />
          {/* 선택된 캐릭터 */}
          <div className="w-1/2 h-full pb-4">
            <div className="h-3/4">
              <CharacterCanvas />
            </div>
            <div className="bg-primary-600 border-[5px] h-1/4 border-primary-700 flex justify-center items-start text-white rounded-lg relative">
              <div className="absolute -top-[117px] -right-6 z-50">
                <Link href={'/nickname'}>
                  <SignButton
                    content="선택완료"
                    onClick={handleClickSelectButton}
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

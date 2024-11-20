'use client'

import RoomActionButton from '@/app/scenario/components/RoomActionButton'
import { useRouter, useSearchParams } from 'next/navigation'
import BackArrowIcon from '/public/icons/back-arrow.svg'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { User, useUser } from '@/app/_contexts/UserContext'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Scenario() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scenarioName = searchParams.get('name')
  const { isConnected } = useWebSocketContext()
  const { user, setUser } = useUser()

  useEffect(() => {
    localStorage.removeItem('roomId')
  }, [])

  const fetchCreateRoom = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rooms`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hostId: user?.userId,
          }),
        },
      )

      const result = await response.json()

      if (result && result?.roomId) {
        router.push(`/scenario/1/room/${result.roomId}`)
        setUser({ ...user, isHost: true } as User)
      }
    } catch (error) {
      console.error('방 생성 중 오류 발생:', error)
    }
  }

  // 방 만들기
  const handleCreateRoom = () => {
    if (isConnected) {
      fetchCreateRoom()
    }
  }

  return (
    <div className="fixed top-0 w-full h-screen bg-[rgba(0,0,0,0.6)] inline-flex flex-col items-center justify-center gap-11 pb-[15vh] z-20 select-none">
      <button
        className="absolute left-10 top-10 flex gap-8 items-center hover:-translate-x-3 transition-all duration-400 ease-in-out"
        onClick={() => router.back()}
      >
        <BackArrowIcon />
        <span className="text-6xl text-white">나가기</span>
      </button>
      <h1 className="bg-wood shadow-md inline-block py-4 text-white px-24 text-5xl rounded-xl">
        {scenarioName}
      </h1>
      <div className="flex gap-16">
        <RoomActionButton
          bgColor="bg-secondary-500"
          label={'방 만들기'}
          onClick={handleCreateRoom}
        >
          <Image
            src="/images/character/bunny.png"
            width={80}
            height={200}
            alt="character"
          />
        </RoomActionButton>
        <RoomActionButton
          bgColor="bg-primary-500"
          label={'방 접속하기'}
          onClick={() => router.push('/scenario/1/enter')}
        >
          <Image
            src="/images/character/fox.png"
            width={100}
            height={200}
            alt="character"
          />
          <Image
            src="/images/character/fox.png"
            width={100}
            height={200}
            alt="character"
          />
        </RoomActionButton>
      </div>
    </div>
  )
}

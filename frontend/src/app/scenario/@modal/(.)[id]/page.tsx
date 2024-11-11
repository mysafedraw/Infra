'use client'

import RoomActionButton from '@/app/scenario/components/RoomActionButton'
import { useRouter, useSearchParams } from 'next/navigation'
import BackArrowIcon from '/public/icons/back-arrow.svg'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'

export default function Scenario() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scenarioName = searchParams.get('name')
  const { isConnected } = useWebSocketContext()

  const fetchCreateRoom = async () => {
    try {
      const response = await fetch('http://70.12.247.148:8080/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostId: 'a8861570-eb52-488f-9138-d8970c38ae86',
        }),
      })

      const result = await response.json()
      console.log(result)

      if (result && result?.roomId) {
        router.push(`/scenario/1/room/${result.roomId}`)
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
    <div className="fixed top-0 w-full h-screen bg-[rgba(0,0,0,0.6)] inline-flex flex-col items-center justify-center gap-11 pb-[15vh] z-20">
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
        />
        <RoomActionButton
          bgColor="bg-primary-500"
          label={'방 접속하기'}
          onClick={() => router.push('/scenario/1/enter')}
        />
      </div>
    </div>
  )
}

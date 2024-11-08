'use client'

import RoomActionButton from '@/app/scenario/components/RoomActionButton'
import { useRouter } from 'next/navigation'
import BackArrowIcon from '/public/icons/back-arrow.svg'

export default function Scenario() {
  const router = useRouter()

  // 방 만들기
  const handleCreateRoom = () => {
    fetchCreateRoom()
  }

  const fetchCreateRoom = async () => {
    try {
      const response = await fetch('http://70.12.247.148:8080/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostId: '92dd8b5e-1245-4f93-a0fd-a1842b7f62fb',
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
        화재 시나리오
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
          onClick={() => router.push('enter')}
        />
      </div>
    </div>
  )
}

'use client'

import RoomActionButton from '@/app/scenario/components/RoomActionButton'
import { useRouter } from 'next/navigation'

export default function Scenario() {
  const router = useRouter()
  return (
    <div className="fixed top-0 w-full h-screen bg-[rgba(0,0,0,0.6)] inline-flex flex-col items-center justify-center gap-11 pb-[15vh]">
      <button
        className="absolute left-10 top-10 flex gap-8 items-center hover:-translate-x-3 transition-all duration-400 ease-in-out"
        onClick={() => router.back()}
      >
        <img src="/icons/back-arrow.svg" className="h-16" />
        <span className="text-6xl text-white">나가기</span>
      </button>
      <h1 className="bg-wood shadow-md inline-block py-4 text-white px-24 text-5xl rounded-xl">
        화재 시나리오
      </h1>
      <div className="flex gap-16">
        <RoomActionButton bgColor="bg-secondary-500" label={'방 만들기'} />
        <RoomActionButton bgColor="bg-primary-500" label={'방 접속하기'} />
      </div>
    </div>
  )
}

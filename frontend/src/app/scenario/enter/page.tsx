'use client'

import { useRouter } from 'next/navigation'
import SignButton from '@/app/_components/SignButton'
import { useState } from 'react'

export default function Enter() {
  const router = useRouter()
  const [roomId, setRoomId] = useState<string>('')

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRoomId(e.target.value)

  const handleMove = async () => {
    // 대기방 페이지로 이동
    router.push(`/room/${roomId}`)
  }
  return (
    <div className="p-20 w-screen h-screen bg-secondary-500 flex flex-col">
      <h1 className="text-6xl text-white font-outline-2 text-center select-none">
        QR 코드를 스캔하거나 방 코드를 입력해주세요
      </h1>
      {/* QR 코드 사진 추가하기 */}
      <div className="size-64"></div>
      <div className="flex h-full justify-center flex-col items-center">
        <div className="flex bg-primary-600 border-4 border-primary-700 w-2/5 h-36 rounded-xl flex-col justify-center items-center">
          {/* 입력 필드 */}
          <input
            value={roomId}
            onChange={handleRoomCodeChange}
            type="text"
            placeholder="방코드 입력"
            className="w-full bg-transparent text-2xl text-center text-primary-800 outline-none placeholder:text-2xl placeholder:text-primary-700"
          />
          <hr className="w-3/4 border-b-2 border-white mt-2" />
        </div>
      </div>
      <div className="flex justify-end">
        <SignButton content={'접속하기'} onClick={handleMove} />
      </div>
    </div>
  )
}

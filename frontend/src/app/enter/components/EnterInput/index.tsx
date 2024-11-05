'use client'

import { useState } from 'react'

export default function EnterInput() {
  const [roomCode, setRoomCode] = useState<string>('')

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRoomCode(e.target.value)

  return (
    <div className="flex bg-primary-600 border-4 border-primary-700 w-2/5 h-36 rounded-xl flex-col justify-center items-center">
      {/* 입력 필드 */}
      <input
        value={roomCode}
        onChange={handleRoomCodeChange}
        type="text"
        placeholder="방코드 입력"
        className="w-full bg-transparent text-2xl text-center text-primary-800 outline-none placeholder:text-2xl placeholder:text-primary-700"
      />
      <hr className="w-3/4 border-b-2 border-white mt-2" />
    </div>
  )
}

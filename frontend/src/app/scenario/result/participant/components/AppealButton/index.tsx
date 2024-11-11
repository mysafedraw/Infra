'use client'

import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'

export default function AppealButton() {
  const { sendMessage } = useWebSocketContext()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록 `useEffect` 안에서 `localStorage`에 접근
    setRoomId(localStorage.getItem('roomNumber'))
    setUserId(localStorage.getItem('userId'))
  }, [])

  const handleAppeal = () => {
    const message = JSON.stringify({ roomId, userId })
    sendMessage('/games/explanation-queue', message)
  }

  return (
    <button
      onClick={handleAppeal}
      className="bg-secondary-50 border-2 border-secondary-500 w-full py-3 rounded-xl hover:bg-secondary-400"
    >
      <p className="text-3xl">억울해요 😢</p>
      <p className="text-xl">
        차례가 되면 마이크를 켜고 의견을 이야기할 수 있어요
      </p>
    </button>
  )
}

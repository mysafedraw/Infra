'use client'

import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/_contexts/UserContext'

export default function AppealButton() {
  const { user } = useUser()
  const { sendMessage, registerCallback } = useWebSocketContext()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [isWaiting, setIsWaiting] = useState(false) // 발언 순서를 기다리는 상태

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))

    registerCallback(`/games/${roomId}`, 'ADD_EXPLAIN_QUEUE', () => {
      setIsWaiting(true)
    })
  }, [registerCallback, roomId])

  const handleAppeal = () => {
    const message = JSON.stringify({ roomId, userId: user?.userId })
    sendMessage('/games/explanation-queue', message)
  }

  return (
    <button
      onClick={handleAppeal}
      disabled={isWaiting}
      className={`${
        isWaiting
          ? 'bg-gray-medium border-gray-dark'
          : 'bg-secondary-200 border-secondary-500'
      } border-2 w-full py-3 rounded-xl ${isWaiting ? '' : 'hover:bg-secondary-400'}`}
    >
      <p className="text-3xl">
        {isWaiting ? '발언 순서를 기다리고 있어요 ⏱' : '억울해요 😢'}
      </p>
      <p className="text-xl">
        차례가 되면 마이크를 켜고 의견을 이야기할 수 있어요
      </p>
    </button>
  )
}

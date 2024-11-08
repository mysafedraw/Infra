'use client'

import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'

export default function AppealButton() {
  const { sendMessage } = useWebSocketContext()

  const roomId = localStorage.getItem('roomNumber')
  const userId = localStorage.getItem('userId')

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

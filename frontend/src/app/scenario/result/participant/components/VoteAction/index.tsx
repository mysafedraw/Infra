import Image from 'next/image'
import Chalkboard from '@/app/scenario/result/components/Chalkboard'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/_contexts/UserContext'

export default function VoteAction() {
  const { sendMessage } = useWebSocketContext()
  const [roomId, setRoomId] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  const handleVote = (isAgreed: boolean) => {
    const message = JSON.stringify({ roomId, isAgreed, userId: user?.userId })
    sendMessage('/games/vote', message)
  }

  return (
    <div className="flex justify-around items-center m-4 w-[36rem]">
      {/* 찬성 버튼 */}
      <button
        onClick={() => handleVote(true)}
        className="flex items-center justify-center p-2 bg-green-100 border-2 border-green-300 rounded-3xl"
      >
        <Image
          src="/icons/thumbs-up.svg"
          alt="thumbs-up"
          width={32}
          height={32}
          className="size-20"
        />
      </button>
      {/* 그림 */}
      <div className="relative flex items-center justify-center w-80 mx-6">
        <Chalkboard drawingImage="/images/drawing.png" />
      </div>
      {/* 반대 버튼 */}
      <button
        onClick={() => handleVote(false)}
        className="flex items-center justify-center p-2 bg-red-100 border-2 border-red-300 rounded-3xl"
      >
        <Image
          src="/icons/thumbs-down.svg"
          alt="thumbs-down"
          width={32}
          height={32}
          className="size-20"
        />
      </button>
    </div>
  )
}

import Image from 'next/image'
import Chalkboard from '@/app/scenario/result/components/Chalkboard'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/_contexts/UserContext'
import Check from '/public/icons/check.svg'
import { useSpeakingRight } from '@/app/_contexts/SpeakingRight'

export default function VoteAction({ drawing }: { drawing: string }) {
  const { sendMessage, registerCallback } = useWebSocketContext()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState<{ agreed: boolean | null }>({
    agreed: null,
  })
  const { user } = useUser()

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  useEffect(() => {
    if (roomId) {
      registerCallback(`/games/${user?.userId}`, 'VOTE', (message) => {
        const { action } = message
        if (action === 'VOTE') {
          // 이미 투표한 상태로 설정
          setHasVoted((prev) => ({
            ...prev,
            agreed: prev.agreed !== null ? prev.agreed : null, // 투표 상태 유지
          }))
        }
      })
    }
  }, [registerCallback, roomId, user?.userId])

  const handleVote = (isAgreed: boolean) => {
    const message = JSON.stringify({ roomId, isAgreed, userId: user?.userId })
    sendMessage('/games/vote', message)
    setHasVoted({ agreed: isAgreed })
  }

  return (
    <div className="flex justify-around items-center m-4 w-[36rem]">
      <div>
        {/* 찬성 버튼 */}
        <button
          onClick={() => handleVote(true)}
          className={`relative flex items-center justify-center p-2 border-2 rounded-3xl ${
            hasVoted.agreed === true
              ? 'bg-green-300 border-green-400'
              : 'bg-green-100 border-green-300 hover:bg-green-300'
          }`}
        >
          {hasVoted.agreed === true && (
            <Check className="absolute -top-6 -left-3 size-12 fill-green-500" />
          )}
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
          <Chalkboard drawingImage={drawing} />
        </div>
        {/* 반대 버튼 */}
        <button
          onClick={() => handleVote(false)}
          className={`relative flex items-center justify-center p-2 border-2 rounded-3xl ${
            hasVoted.agreed === false
              ? 'bg-red-300 border-red-400'
              : 'bg-red-100 border-red-300 hover:bg-red-300'
          }`}
        >
          {hasVoted.agreed === false && (
            <Check className="absolute -top-6 -left-3 size-12 fill-red-500" />
          )}
          <Image
            src="/icons/thumbs-down.svg"
            alt="thumbs-down"
            width={32}
            height={32}
            className="size-20"
          />
        </button>
      </div>
    </div>
  )
}

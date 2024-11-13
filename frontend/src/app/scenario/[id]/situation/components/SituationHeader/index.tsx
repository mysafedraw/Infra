'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import BackArrowIcon from '/public/icons/back-arrow.svg'
import { useUser } from '@/app/_contexts/UserContext'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'

interface DrawStartResponse {
  action: 'DRAWING_START'
  endTime: number
  timeLimit: number
}

export default function SituationHeader({
  title,
  showNextButton = false,
}: {
  title: string
  showNextButton?: boolean // 다음으로 버튼 표시 여부
}) {
  const router = useRouter()
  const { client, isConnected, sendMessage, registerCallback } =
    useWebSocketContext()
  const { user } = useUser()
  const [roomId, setRoomId] = useState<string | null>(null)

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  const handleMoveDraw = () => {
    if (!client || !isConnected) return

    sendMessage(
      `/games/drawing/start`,
      JSON.stringify({ roomId: localStorage.getItem('roomId') }),
    )
  }

  // 그림 그리기 시작 응답 처리
  const handleDrawingStartResponse = (response: DrawStartResponse) => {
    localStorage.setItem('endTime', String(response.endTime))
    localStorage.setItem('timeLimit', String(response.timeLimit))

    if (user?.isHost) {
      router.push(`/scenario/result/host`)
    } else {
      router.push('/scenario/1/draw')
    }
  }

  useEffect(() => {
    if (isConnected) {
      registerCallback(
        `/games/${roomId}`,
        'DRAWING_START',
        handleDrawingStartResponse,
      )
    }
  }, [isConnected, handleMoveDraw, handleDrawingStartResponse])

  return (
    <div className="flex flex-row items-center justify-between p-4">
      <div className="flex flex-row items-center">
        <BackArrowIcon
          width={60}
          height={60}
          className="h-12 w-auto cursor-pointer pointer-events-auto"
          onClick={() => router.back()}
        />
        <div className="bg-white border-primary-500 border-4 p-4 px-12 rounded-3xl ml-4">
          <h3 className="text-4xl">{title}</h3>
        </div>
      </div>

      {/* 그림 그리기 시작 (방장만) */}
      {showNextButton && user?.isHost && (
        <div className="text-center">
          <button
            className="right-6 flex items-center justify-center"
            onClick={handleMoveDraw}
          >
            <Image
              src="/images/wood-arrow.png"
              alt="game-start"
              width={241}
              height={88}
              className="h-16 w-auto cursor-pointer pointer-events-auto"
              priority
            />
            <p className="absolute text-white text-4xl shadow-lg pr-2">
              다음으로
            </p>
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import ScoredBoard from '@/app/scenario/result/components/ScoredBoard'
import VotingSidebar from '@/app/scenario/result/components/VotingSidebar'
import AllAnswers from '@/app/scenario/result/components/AllAnswers'
import AppealButton from '@/app/scenario/result/participant/components/AppealButton'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/_contexts/UserContext'
import { AnswerData } from '@/app/scenario/result/types/answerTypes'

export default function ScenarioResultParticipant() {
  const router = useRouter()
  const { sendMessage, registerCallback } = useWebSocketContext()
  const { user } = useUser()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [myDrawing, setMyDrawing] = useState<AnswerData>()
  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  useEffect(() => {
    const message = JSON.stringify({ userId: user?.userId })
    sendMessage('/games/my-drawing', message)

    registerCallback(`/games/${user?.userId}`, 'MY_DRAWING', (message) => {
      const { userId, nickname, isCorrect, drawingSrc, avatarsImgSrc } = message
      setMyDrawing({
        id: userId,
        nickname,
        isCorrect: isCorrect === 'CORRECT_ANSWER',
        drawingImage: drawingSrc,
        characterImage:
          avatarsImgSrc === 'null' ? '/images/tiger.png' : avatarsImgSrc,
      })
    })
  }, [registerCallback, sendMessage, user?.userId])

  useEffect(() => {
    const stageNumber = parseInt(localStorage.getItem('stageNumber') || '1') // 기본값 1 설정

    const handleGameStart = () => {
      router.push(`/scenario/1/situation/step${stageNumber + 1}`)
    }

    registerCallback(`/games/${roomId}`, 'GAME_START', handleGameStart)
  }, [registerCallback, roomId, router])

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="mb-4 w-2/5 bg-wood bg-cover bg-left text-5xl text-white text-center py-4 rounded-xl shadow-lg">
        작은 불 끄기
      </h2>
      <div className="relative">
        <ScoredBoard
          data={
            myDrawing || {
              id: '1',
              isCorrect: false,
              nickname: '이구역그림짱은나야 (나)',
              characterImage: '/images/tiger.png',
              drawingImage: '/images/drawing.png',
            }
          }
        />
      </div>
      <AppealButton />
      <AllAnswers />

      <VotingSidebar role="participant" />
    </div>
  )
}

'use client'

import ScoredBoard from '@/app/scenario/result/components/ScoredBoard'
import VotingSidebar from '@/app/scenario/result/components/VotingSidebar'
import AllAnswers from '@/app/scenario/result/components/AllAnswers'
import AppealButton from '@/app/scenario/result/participant/components/AppealButton'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/_contexts/UserContext'
import { useLiveKit } from '@/app/_contexts/LiveKitContext'
import { AnswerData } from '@/app/scenario/result/types/answerTypes'
import { useSpeakingRight } from '@/app/_contexts/SpeakingRight'

export default function ScenarioResultParticipant() {
  const router = useRouter()
  const { sendMessage, registerCallback } = useWebSocketContext()
  const { joinVoiceRoom } = useLiveKit()
  const { user } = useUser()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [myDrawing, setMyDrawing] = useState<AnswerData>()
  const { speakingRightInfo } = useSpeakingRight()

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

  useEffect(() => {
    if (speakingRightInfo && speakingRightInfo.userId !== user?.userId) {
      setIsListening(true)
    } else {
      setIsListening(false)
    }
  }, [speakingRightInfo, user?.userId])

  const handleListen = async () => {
    if (roomId && user?.userId) {
      await joinVoiceRoom(roomId, user.userId) // listener로 방 참여
    }
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <span className="absolute top-9 left-6 animate-bounce">
        {isListening && (
          <button
            onClick={handleListen}
            className="inline-flex items-center px-5 py-4 h-full text-3xl shadow rounded-lg text-sky-500 bg-white ring-2 ring-secondary-500"
          >
            진행 중인 발언 듣기📣
          </button>
        )}
      </span>

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

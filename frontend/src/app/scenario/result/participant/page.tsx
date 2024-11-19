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
import { useSpeakingRight } from '@/app/_contexts/SpeakingRight'
import { useOpenVidu } from '@/app/_contexts/OpenViduContext'

export default function ScenarioResultParticipant() {
  const router = useRouter()
  const { sendMessage, registerCallback } = useWebSocketContext()
  const { joinVoiceRoom, leaveVoiceRoom } = useOpenVidu()
  const { user } = useUser()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false) // 음성채팅 참여 상태
  const [myDrawing, setMyDrawing] = useState<AnswerData>()
  const { speakingRightInfo } = useSpeakingRight()

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  useEffect(() => {
    sendMessage('/games/my-drawing', JSON.stringify({ userId: user?.userId }))

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

    const handleGameStart = (response: {
      action: string
      situationDialogue: string
    }) => {
      router.push(`/scenario/1/situation/step${stageNumber + 1}`)
      localStorage.setItem('situationDialogue', response?.situationDialogue)
    }

    registerCallback(`/games/${roomId}`, 'GAME_START', handleGameStart)

    if (stageNumber === 5) {
      registerCallback(`/games/${roomId}`, 'FINAL_RANK', () => {
        router.push(`/scenario/1/ranking`)
      })
    }
  }, [registerCallback, roomId, router])

  useEffect(() => {
    if (speakingRightInfo && speakingRightInfo.userId === user?.userId) {
      setIsListening(true)
    }
  }, [speakingRightInfo, user?.userId])

  const handleListen = async () => {
    if (isListening) {
      // 음성 채팅방 나가기
      await leaveVoiceRoom()
      setIsListening(false)
    } else {
      // 음성 채팅방 참여
      if (roomId && user?.userId) {
        await joinVoiceRoom(roomId, user.userId)
        setIsListening(true)
      }
    }
  }

  return (
    <div className="p-6 flex flex-col items-center">
      {/* 음성 채팅방 참여 중일 때만 버튼 표시 */}
      {speakingRightInfo?.userId !== user?.userId && (
        <span className="absolute top-9 left-6">
          <button
            onClick={handleListen}
            className={`inline-flex items-center px-5 py-4 h-full text-3xl shadow rounded-lg ${
              isListening
                ? 'text-gray-dark bg-white ring-2 ring-gray-dark'
                : 'text-sky-500 bg-white ring-2 ring-secondary-500 animate-bounce'
            }`}
          >
            {isListening ? '음성 채팅방 나가기 ❌' : '음성 채팅방 참여하기 📣'}
          </button>
        </span>
      )}

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

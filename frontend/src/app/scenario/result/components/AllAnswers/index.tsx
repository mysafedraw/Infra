'use client'

import ScoredBoard from '@/app/scenario/result/components/ScoredBoard'
import { AnswerData } from '@/app/scenario/result/types/answerTypes'
import { useEffect, useState } from 'react'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useUser } from '@/app/_contexts/UserContext'

interface User {
  userId: string
  nickname: string
  isCorrect: string
  drawingSrc: string
  avatarsImgSrc: string
}

interface CheckAllAnswersMessage {
  action: 'CHECK_ALL_ANSWERS'
  users: User[]
}

export default function AllAnswers() {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [answerData, setAnswerData] = useState<AnswerData[]>([])
  const { isConnected, sendMessage, registerCallback } = useWebSocketContext()
  const { user } = useUser()

  const handleReceivedMessage = (message: CheckAllAnswersMessage) => {
    const newAnswerData = message.users.map((userData: User) => ({
      id: userData.userId,
      isCorrect: userData.isCorrect === 'CORRECT_ANSWER',
      nickname: userData.nickname,
      characterImage:
        userData.avatarsImgSrc === 'null'
          ? '/images/tiger.png'
          : userData.avatarsImgSrc,
      drawingImage: userData.drawingSrc,
    }))
    setAnswerData(newAnswerData)
  }

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  useEffect(() => {
    // CHECK_ALL_ANSWERS action에 대한 콜백 등록
    registerCallback(
      `/games/${roomId}`,
      'CHECK_ALL_ANSWERS',
      handleReceivedMessage,
    )
  }, [registerCallback, roomId])

  // WebSocket 연결이 완료된 후 /games/answers로 요청 보내기
  useEffect(() => {
    if (isConnected) {
      sendMessage(
        '/games/answers',
        JSON.stringify({
          roomId,
        }),
      )
    }
  }, [isConnected, roomId, sendMessage])

  return (
    <div className="grid grid-cols-3 gap-x-6 mt-4">
      {answerData
        .filter((data) => data.id !== user?.userId)
        .map((data) => (
          <ScoredBoard key={data.id} data={data} />
        ))}
    </div>
  )
}

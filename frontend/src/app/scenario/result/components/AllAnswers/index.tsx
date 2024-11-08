'use client'

import ScoredBoard from '@/app/scenario/result/components/ScoredBoard'
import { AnswerData } from '@/app/scenario/result/types/answerTypes'
import { useEffect, useState } from 'react'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'

interface User {
  userId: number
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
  const [roomNumber, setRoomNumber] = useState<string | null>(null)
  const [answerData, setAnswerData] = useState<AnswerData[]>([])
  const { isConnected, sendMessage, registerCallback } = useWebSocketContext()

  const handleReceivedMessage = (message: CheckAllAnswersMessage) => {
    const newAnswerData = message.users.map((user: User) => ({
      id: user.userId,
      isCorrect: user.isCorrect === 'CORRECT_ANSWER',
      nickname: user.nickname,
      characterImage: user.avatarsImgSrc,
      drawingImage: user.drawingSrc,
    }))
    setAnswerData(newAnswerData)
  }

  useEffect(() => {
    // 클라이언트 사이드에서만 localStorage 접근
    setRoomNumber(localStorage.getItem('roomNumber'))
  }, [])

  useEffect(() => {
    // CHECK_ALL_ANSWERS action에 대한 콜백 등록
    registerCallback(
      `/games/${roomNumber}`,
      'CHECK_ALL_ANSWERS',
      handleReceivedMessage,
    )
  }, [registerCallback, roomNumber])

  // WebSocket 연결이 완료된 후 /games/answers로 요청 보내기
  useEffect(() => {
    if (isConnected) {
      sendMessage(
        '/games/answers',
        JSON.stringify({
          roomId: roomNumber,
        }),
      )
    }
  }, [isConnected, roomNumber, sendMessage])

  return (
    <div className="grid grid-cols-3 gap-x-6">
      {answerData.map((data) => (
        <ScoredBoard key={data.id} data={data} />
      ))}
    </div>
  )
}

'use client'

import ScoredBoard from '@/app/scenario/result/components/ScoredBoard'
import { AnswerData } from '@/app/scenario/result/types/answerTypes'
import { useCallback, useEffect, useState } from 'react'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'

interface User {
  userId: string
  nickname: string
  isCorrect: string
  drawingSrc: string
  avatarsImgSrc: string
}

export default function AllAnswers() {
  const [answerData, setAnswerData] = useState<AnswerData[]>([])
  const roomId = '859338'
  const { client, isConnected, sendMessage } = useWebSocketContext()

  const handleReceivedMessage = useCallback((message: string) => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.action === 'CHECK_ALL_ANSWERS') {
      // 응답 받은 데이터를 AnswerData 형식으로 변환
      const newAnswerData: AnswerData[] = parsedMessage.users.map(
        (user: User) => ({
          id: user.userId,
          isCorrect: user.isCorrect === 'CORRECT_ANSWER',
          nickname: user.nickname,
          characterImage: user.avatarsImgSrc,
          drawingImage: user.drawingSrc,
        }),
      )
      setAnswerData(newAnswerData)
    }
  }, [])

  useEffect(() => {
    if (client && isConnected) {
      const subscription = client.subscribe(`/games/${roomId}`, (message) => {
        handleReceivedMessage(message.body)
      })
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [client, handleReceivedMessage, isConnected, roomId])

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
  }, [isConnected, sendMessage])

  return (
    <div className="grid grid-cols-3 gap-x-6">
      {answerData.map((data) => (
        <ScoredBoard key={data.id} data={data} />
      ))}
    </div>
  )
}

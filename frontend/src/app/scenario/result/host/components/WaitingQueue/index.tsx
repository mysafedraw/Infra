'use client'

import ExplainQueueBoard from '@/app/scenario/result/host/components/ExplainQueueBoard'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'

interface AnswerData {
  id: number
  isCorrect: boolean
  nickname: string
  characterImage: string
  drawingImage: string
}

interface User {
  userId: number
  nickname: string
  isCorrect: string
  drawingSrc: string
  avatarsImgSrc: string
}

interface AddExplainQueueMessage {
  action: 'ADD_EXPLAIN_QUEUE'
  waitingQueue: User[]
}

export default function WaitingQueue() {
  const [waitingData, setWaitingData] = useState<AnswerData[]>([])
  const roomId = localStorage.getItem('roomNumber')
  const { registerCallback } = useWebSocketContext()

  const handleReceivedMessage = (message: AddExplainQueueMessage) => {
    const newWaitingData: AnswerData[] = message.waitingQueue.map((user) => ({
      id: user.userId,
      isCorrect: false,
      nickname: user.nickname,
      characterImage: user.avatarsImgSrc,
      drawingImage: user.drawingSrc,
    }))
    setWaitingData(newWaitingData)
  }

  useEffect(() => {
    // ADD_EXPLAIN_QUEUE action에 대한 콜백 등록
    registerCallback(
      `/games/${roomId}`,
      'ADD_EXPLAIN_QUEUE',
      handleReceivedMessage,
    )
  }, [registerCallback, roomId])

  return (
    <button className="flex gap-x-6 w-full overflow-x-auto overflow-y-hidden mt-4 ps-1">
      {waitingData.map((data) => (
        <ExplainQueueBoard key={data.id} data={data} />
      ))}
    </button>
  )
}

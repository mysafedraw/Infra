'use client'

import ExplainQueueBoard from '@/app/scenario/result/host/components/ExplainQueueBoard'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import { AnswerData } from '@/app/scenario/result/types/answerTypes'
import { useSpeakingRight } from '@/app/_contexts/SpeakingRight'

interface User {
  userId: string
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
  const [roomId, setRoomId] = useState<string | null>(null)

  const { registerCallback, sendMessage } = useWebSocketContext()
  const { setSpeakingRightInfo } = useSpeakingRight()

  const handleReceivedMessage = (message: AddExplainQueueMessage) => {
    const newWaitingData: AnswerData[] = message.waitingQueue.map((user) => ({
      id: user.userId,
      isCorrect: false,
      nickname: user.nickname,
      characterImage:
        user.avatarsImgSrc === 'null'
          ? '/images/tiger.png'
          : user.avatarsImgSrc,
      drawingImage: user.drawingSrc,
    }))
    setWaitingData(newWaitingData)
  }

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  useEffect(() => {
    registerCallback(`/games/${roomId}`, 'HAVE_A_SAY', (message) => {
      setSpeakingRightInfo(message)
    })
  }, [registerCallback, roomId, setSpeakingRightInfo])

  useEffect(() => {
    // ADD_EXPLAIN_QUEUE action에 대한 콜백 등록
    registerCallback(
      `/games/${roomId}`,
      'ADD_EXPLAIN_QUEUE',
      handleReceivedMessage,
    )
  }, [registerCallback, roomId])

  const handleGrantSpeakingRight = (userId: string) => {
    if (roomId) {
      // /games/say 엔드포인트로 발언권 요청을 전송
      const message = JSON.stringify({ roomId, userId })
      sendMessage('/games/say', message)
    } else {
      console.error('roomId를 찾을 수 없습니다.')
    }
  }

  return (
    <div className="flex mr-auto gap-x-6 overflow-y-hidden overflow-x-auto w-full mt-2">
      {waitingData.map((data) => (
        <button onClick={() => handleGrantSpeakingRight(data.id)} key={data.id}>
          <ExplainQueueBoard data={data} />
        </button>
      ))}
    </div>
  )
}

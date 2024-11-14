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
  const [grantedUserId, setGrantedUserId] = useState<string | null>(null) // 발언권 부여된 사용자 ID

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
      setGrantedUserId(message.userId) // 발언권 부여된 사용자 ID 저장
    })

    registerCallback(`/games/${roomId}`, 'REVOKE_A_SAY', () => {
      setSpeakingRightInfo(null)
      setGrantedUserId(null)
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
    if (!roomId) {
      console.error('roomId를 찾을 수 없습니다.')
      return
    }

    // 기존 발언권 회수
    const revokeMessage = JSON.stringify({ roomId, userId: grantedUserId })
    sendMessage('/games/say-revoke', revokeMessage)
    setGrantedUserId(null) // 발언권 회수 후 상태 초기화
    setSpeakingRightInfo(null)

    if (grantedUserId !== userId) {
      // 발언권 부여 요청
      const grantMessage = JSON.stringify({ roomId, userId })
      sendMessage('/games/say', grantMessage)
      setGrantedUserId(userId) // 발언권 부여 후 상태 업데이트
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

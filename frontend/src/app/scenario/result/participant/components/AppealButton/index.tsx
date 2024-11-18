'use client'

import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/_contexts/UserContext'
import SpeakingRightsToast from '@/app/scenario/result/participant/components/SpeakingRightsToast'
import { useSpeakingRight } from '@/app/_contexts/SpeakingRight'
import { useOpenVidu } from '@/app/_contexts/OpenViduContext'

const BUTTON_CONFIG_MAP = {
  hasSpeakingRight: {
    text: '발언 중이에요 📣',
    style: 'bg-secondary-200 border-secondary-500',
  },
  hasSpoken: {
    text: '발언은 한 번씩만 할 수 있어요 🙅‍♂️',
    style: 'bg-gray-medium border-gray-dark',
  },
  isWaiting: {
    text: '발언 순서를 기다리고 있어요 ⏱',
    style: 'bg-gray-medium border-gray-dark',
  },
  default: {
    text: '억울해요 😢',
    style: 'bg-secondary-200 border-secondary-500 hover:bg-secondary-400',
  },
}

export default function AppealButton() {
  const { user } = useUser()
  const { sendMessage, registerCallback } = useWebSocketContext()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [isWaiting, setIsWaiting] = useState(false) // 발언 순서를 기다리는 상태
  const [hasSpeakingRight, setHasSpeakingRight] = useState(false) // 발언권이 있는 상태
  const [hasSpoken, setHasSpoken] = useState(false) // 발언권이 회수된 상태
  const { setSpeakingRightInfo } = useSpeakingRight()
  const { muteMicrophone } = useOpenVidu()

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))

    registerCallback(`/games/${roomId}`, 'ADD_EXPLAIN_QUEUE', (message) => {
      const { waitingQueue } = message

      const isUserInQueue = waitingQueue.some(
        (queueItem: { userId: string }) => queueItem.userId === user?.userId,
      )

      setIsWaiting(isUserInQueue)
    })

    // 발언권을 얻었을 때 상태 업데이트
    registerCallback(`/games/${roomId}`, 'HAVE_A_SAY', (message) => {
      setSpeakingRightInfo(message)
      const { userId } = message
      if (userId === user?.userId) {
        setHasSpeakingRight(true)
        setIsWaiting(false) // 발언권을 얻었으므로 대기 상태 해제
      }
    })

    // 발언권이 회수되었을 때 상태 업데이트
    registerCallback(`/games/${roomId}`, 'REVOKE_A_SAY', () => {
      setSpeakingRightInfo(null)
      if (hasSpeakingRight) {
        setHasSpeakingRight(false)
        setHasSpoken(true) // 발언권이 회수되면 발언 완료 상태로 설정
        muteMicrophone() // 마이크 음소거
      }
    })
  }, [
    hasSpeakingRight,
    registerCallback,
    roomId,
    setSpeakingRightInfo,
    user?.userId,
  ])

  const handleAppeal = async () => {
    // 발언 대기 중 상태 설정
    const message = JSON.stringify({ roomId, userId: user?.userId })
    sendMessage('/games/explanation-queue', message)
    setIsWaiting(true)
  }

  const { text, style } =
    (hasSpeakingRight && BUTTON_CONFIG_MAP.hasSpeakingRight) ||
    (hasSpoken && BUTTON_CONFIG_MAP.hasSpoken) ||
    (isWaiting && BUTTON_CONFIG_MAP.isWaiting) ||
    BUTTON_CONFIG_MAP.default

  return (
    <>
      <button
        onClick={handleAppeal}
        disabled={isWaiting || hasSpoken || hasSpeakingRight}
        className={`${style} border-2 w-full py-3 rounded-xl`}
      >
        <p className="text-3xl">{text}</p>
        {!hasSpoken && !hasSpeakingRight && (
          <p className="text-xl">
            차례가 되면 마이크를 켜고 의견을 이야기할 수 있어요
          </p>
        )}
      </button>

      {hasSpeakingRight && <SpeakingRightsToast />}
    </>
  )
}

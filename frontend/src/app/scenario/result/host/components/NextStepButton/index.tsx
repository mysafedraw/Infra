'use client'

import Image from 'next/image'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useRouter } from 'next/navigation'

export default function NextStepButton() {
  const { sendMessage } = useWebSocketContext()
  const router = useRouter()

  const handleNextStep = () => {
    const roomId = localStorage.getItem('roomId')
    const nextStageNumber =
      parseInt(localStorage.getItem('stageNumber') || '1') + 1

    if (roomId && nextStageNumber) {
      const message = JSON.stringify({
        roomId,
        stageNumber: nextStageNumber,
      })

      sendMessage('/games/start', message)

      if (nextStageNumber === 6) {
        router.push(`/scenario/1/ranking`)
        return
      }
      router.push(`/scenario/1/situation/step${nextStageNumber}`)
    } else {
      console.warn('필요한 데이터가 localStorage에 없습니다.')
    }
  }

  return (
    <button
      onClick={handleNextStep}
      className="absolute right-6 flex items-center justify-center"
    >
      <Image
        src="/images/wood-arrow.png"
        alt="next"
        width={241}
        height={88}
        className="h-20 w-auto"
      />
      <p className="absolute text-white text-4xl shadow-lg pr-2">다음 단계로</p>
    </button>
  )
}

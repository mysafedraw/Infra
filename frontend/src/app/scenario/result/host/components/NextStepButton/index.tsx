'use client'

import Image from 'next/image'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useRouter } from 'next/navigation'
import { useOpenVidu } from '@/app/_contexts/OpenViduContext'

export default function NextStepButton() {
  const { sendMessage } = useWebSocketContext()
  const { muteMicrophone } = useOpenVidu()
  const router = useRouter()

  const handleNextStep = async () => {
    const roomId = localStorage.getItem('roomId')
    const nextStageNumber =
      parseInt(localStorage.getItem('stageNumber') || '1') + 1

    if (roomId && nextStageNumber) {
      const message = JSON.stringify({
        roomId,
        stageNumber: nextStageNumber,
      })

      await sendMessage('/games/start', message)

      localStorage.setItem('stageNumber', nextStageNumber.toString()) // stage 업데이트

      if (nextStageNumber === 6) {
        router.push(`/scenario/1/ranking`)
        return
      }


      muteMicrophone() // 방장 발언 중일 경우 mute
      sendMessage('/games/start', message)
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

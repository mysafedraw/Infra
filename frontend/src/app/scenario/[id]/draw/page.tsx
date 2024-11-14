'use client'

import { useCallback, useEffect, useState } from 'react'
import DrawingBoard from '@/app/scenario/[id]/draw/components/DrawingBoard'
import DrawTimer from '@/app/scenario/[id]/draw/components/DrawTimer'
import Image from 'next/image'
import QuestionBubble from '@/app/scenario/[id]/draw/components/QuestionBubble'
import { DRAW_TYPES } from '@/app/_constants/draw'
import CommonToast from '@/app/_components/CommonToast'
import { useRouter } from 'next/navigation'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useUser } from '@/app/_contexts/UserContext'

interface DrawResponse {
  label: string
  probability: number
}

interface CheckAnswerResponse {
  action: 'CHECK_ANSWER'
  isCorrect: string
}

export default function Draw() {
  const scenario =
    '헉 콘센트에 불이 붙었어!\n초기에 빨리 진압해야 할 텐데... 지금 필요한 건.....'

  const router = useRouter()
  const [canvasData, setCanvasData] = useState<(() => string) | null>(null)
  const [question, setQuestion] = useState<string>('...')
  const [label, setLabel] = useState<string>('')
  const [showRetryToast, setShowRetryToast] = useState(false)

  const { sendMessage, registerCallback } = useWebSocketContext()
  const { user } = useUser()

  const [roomId, setRoomId] = useState<string | null>(null)
  const [stageNumber, setStageNumber] = useState<string | null>(null)
  const [isTimeEnded, setIsTimeEnded] = useState(false)
  const [hasSentAnswer, setHasSentAnswer] = useState(false)

  // roomId, stageNumber 가져오기
  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
    setStageNumber(localStorage.getItem('stageNumber'))
  }, [])

  const getParticle = (word: string): string => {
    if (!word) return '를'
    const lastChar = word.charAt(word.length - 1)
    const hasJongseong = (lastChar.charCodeAt(0) - 0xac00) % 28 > 0
    return hasJongseong ? '을' : '를'
  }

  // 예측 결과를 받아와 한글로 변환
  const handlePrediction = (prediction: DrawResponse) => {
    if (isTimeEnded) return

    if (prediction) {
      const translatedLabel = DRAW_TYPES[prediction.label] || prediction.label
      if (prediction?.probability >= 35) {
        const particle = getParticle(translatedLabel)
        setQuestion(`${translatedLabel}${particle} 그린 건가요?`)
        setLabel(prediction.label)
      } else {
        setQuestion(`...`)
        setLabel('')
      }
    }
  }

  // DrawingBoard로부터 캔버스 데이터를 가져오는 함수를 저장
  const handleDrawSubmit = useCallback((getCanvas: () => string) => {
    setCanvasData(() => getCanvas)
  }, [])

  // 그림을 서버에 전송
  const fetchDraw = async (): Promise<boolean> => {
    if (!canvasData || hasSentAnswer) return false

    const currentCanvasData = canvasData()

    const tempCanvas = document.createElement('canvas')
    const tempContext = tempCanvas.getContext('2d')
    const img = new window.Image()

    img.src = currentCanvasData
    await new Promise((resolve) => (img.onload = resolve))

    tempCanvas.width = img.width
    tempCanvas.height = img.height

    if (tempContext) {
      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(img, 0, 0)

      const imageData = tempContext.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
      )
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]

        if (r < 50 && g < 50 && b < 50 && a > 0) {
          data[i] = 255 // R
          data[i + 1] = 255 // G
          data[i + 2] = 255 // B
        }
      }

      // 변경된 이미지 데이터를 다시 캔버스에 적용
      tempContext.putImageData(imageData, 0, 0)
    }

    const dataUrl = tempCanvas.toDataURL('image/png')
    const blob = await fetch(dataUrl).then((res) => res.blob())

    const formData = new FormData()
    formData.append('file', blob, 'drawing.png')
    formData.append('userId', user?.userId || '')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/answer`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (response.ok) {
        return true
      } else {
        console.error('서버 전송 실패')
        return false
      }
    } catch (error) {
      console.error('그림 전송 중 오류 발생:', error)
      return false
    }
  }

  // 그림 정답 확인 및 처리
  const handleAnswerProcess = async (isTimeEnd: boolean = false) => {
    if (hasSentAnswer) return

    // 정답 확인 로직
    return new Promise<void>((resolve) => {
      const request = {
        roomId: roomId,
        scenarioId: 1,
        stageNumber: Number(stageNumber),
        answer: DRAW_TYPES[label] ?? '',
        userId: user?.userId,
      }

      sendMessage('/games/answer', JSON.stringify(request))

      registerCallback(
        `/games/${user?.userId}`,
        'CHECK_ANSWER',
        async (response: CheckAnswerResponse) => {
          if (response.isCorrect === 'INCORRECT_ANSWER') {
            if (!isTimeEnd) {
              setShowRetryToast(true)
              setTimeout(() => setShowRetryToast(false), 1000)
              resolve()
              return
            }
          }

          // CORRECT_ANSWER나 PROHIBITED_ANSWER인 경우, 또는 시간 종료 시
          const isSuccess = await fetchDraw()
          if (isSuccess) {
            setHasSentAnswer(true)

            const moveLabel = label.replace(/\s/g, '')

            // 정답 상호작용 페이지로 이동
            if (response.isCorrect === 'CORRECT_ANSWER') {
              router.push(
                `/scenario/1/situation/step${stageNumber}/success/${moveLabel}`,
              )
              // 오답 상호작용 페이지로 이동
            } else if (response.isCorrect === 'PROHIBITED_ANSWER') {
              router.push(
                `/scenario/1/situation/step${stageNumber}/fail/${moveLabel}`,
              )
              // 오답 페이지로 이동
            } else if (response.isCorrect === 'INCORRECT_ANSWER') {
              router.push(`/scenario/1/situation/step${stageNumber}/fail`)
            }
          }
          resolve()
        },
      )
    })
  }

  // 제출 버튼
  const handleSubmit = async () => {
    await handleAnswerProcess(false)
  }

  // 타이머 종료
  const handleTimeEnd = async () => {
    setIsTimeEnded(true)
    await handleAnswerProcess(true)
  }

  return (
    <div className="h-screen w-full bg-secondary-500 flex flex-col p-10">
      {/* 시나리오 말풍선 문장 */}
      <div className="flex py-4 px-2 bg-primary-600 border-4 border-primary-700 w-full rounded-md justify-center">
        <p className="whitespace-pre-wrap leading-9 text-center text-text text-4xl select-none">
          {scenario}
        </p>
      </div>
      {/* 그림판 */}
      <div className="relative mt-4">
        <DrawingBoard
          onPrediction={handlePrediction}
          onDrawSubmit={handleDrawSubmit}
          isTimerEnded={isTimeEnded}
        />
        <DrawTimer handleTimeEnd={handleTimeEnd} />
      </div>
      <div className="flex mt-4">
        <div className="flex justify-center w-full">
          <QuestionBubble content={question} />
        </div>
        <button
          className="absolute right-6 flex items-center justify-center"
          onClick={handleSubmit}
        >
          <Image
            src="/images/wood-arrow.png"
            alt="draw-submit"
            width={241}
            height={88}
            className="h-16 w-auto"
            priority
          />
          <p className="absolute text-white text-4xl shadow-lg pr-2">
            제출하기
          </p>
        </button>
      </div>
      {isTimeEnded && (
        <CommonToast
          message="시간이 끝났어요"
          duration={3000}
          imageSrc="/images/tiger.png"
          altText="draw-rights-icon"
        />
      )}

      {showRetryToast && (
        <CommonToast
          message="다시 생각해보세요"
          duration={1000}
          imageSrc="/images/tiger.png"
          altText="draw-retry-icon"
        />
      )}
    </div>
  )
}

'use client'

import DrawingBoard from '@/app/draw/components/DrawingBoard'
import DrawTimer from '@/app/draw/components/DrawTimer'
import Image from 'next/image'
import ProgressBarTimer from '@/app/draw/components/ProgressBarTimer'
import QuestionBubble from '@/app/draw/components/QuestionBubble'

export default function Draw() {
  const scenario =
    '헉 콘센트에 불이 붙었어!\n초기에 빨리 진압해야 할 텐데... 지금 필요한 건.....'

  const question = '소화기를 그린 건가요?'

  const handleNext = () => {}

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
        <DrawingBoard />
        <ProgressBarTimer initialTime={14} handleTimeEnd={handleNext} />
        <DrawTimer initialTime={14} handleTimeEnd={handleNext} />
      </div>
      <div className="flex mt-4">
        <div className="flex justify-center w-full">
          <QuestionBubble content={question} />
        </div>
        <button className="absolute right-6 flex items-center justify-center">
          <Image
            src="/images/wood-arrow.png"
            alt="draw-submit"
            width={241}
            height={88}
            className="h-20 w-auto"
            priority
          />
          <p className="absolute text-white text-4xl shadow-lg pr-2">
            제출하기
          </p>
        </button>
      </div>
    </div>
  )
}

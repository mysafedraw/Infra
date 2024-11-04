'use client'

import DrawingBoard from './components/DrawingBoard'
import DrawTimer from './components/DrawTimer'
import QuestionBoard from './components/QuestionBoard'

export default function Draw() {
  const question =
    '헉 콘센트에 불이 붙었어!\n초기에 빨리 진압해야 할 텐데... 지금 필요한 건.....'

  const handleNext = () => {}

  return (
    <div className="p-10 w-screen h-screen bg-secondary-500 flex flex-col">
      <QuestionBoard content={question} />
      <div className="mt-4 flex-1 relative">
        <DrawingBoard />
        <div className="absolute left-1 top-1">
          <DrawTimer initialTime={80} handleTimeEnd={handleNext} />
        </div>
      </div>
    </div>
  )
}

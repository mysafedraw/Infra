import Image from 'next/image'
import AnswerBoard from '@/app/scenario/result/components/AnswerBoard'
import { AnswerData } from '@/app/scenario/result/types/answerTypes'

interface ScoredBoardProps {
  data: AnswerData
}

export default function ScoredBoard({ data }: ScoredBoardProps) {
  const { id, isCorrect, nickname, characterImage, drawingImage } = data

  return (
    <div className="relative">
      <div className="z-10 absolute top-1 -left-1 bg-white px-5 py-2 rounded-lg border-2 border-gray-medium">
        <Image
          src={isCorrect ? '/icons/correct.svg' : '/icons/wrong.svg'}
          alt={isCorrect ? 'correct' : 'wrong'}
          width={46}
          height={46}
        />
      </div>
      <AnswerBoard
        id={id}
        nickname={nickname}
        characterImage={characterImage}
        drawingImage={drawingImage}
      />
    </div>
  )
}

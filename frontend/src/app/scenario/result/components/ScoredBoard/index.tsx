import Image from 'next/image'
import AnswerBoard from '@/app/scenario/result/components/AnswerBoard'

interface ScoredBoardProps {
  isCorrect: boolean
  nickname: string
  characterImage: string
  drawingImage: string
}

export default function ScoredBoard({
  isCorrect,
  nickname,
  characterImage,
  drawingImage,
}: ScoredBoardProps) {
  return (
    <div className="relative">
      <div className="z-10 absolute top-0 -left-1 bg-white px-5 py-2 rounded-lg border-2 border-gray-medium">
        <Image
          src={isCorrect ? '/icons/correct.svg' : '/icons/wrong.svg'}
          alt={isCorrect ? 'correct' : 'wrong'}
          width={46}
          height={46}
        />
      </div>
      <AnswerBoard
        nickname={nickname}
        characterImage={characterImage}
        drawingImage={drawingImage}
      />
    </div>
  )
}

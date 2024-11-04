import ScoredBoard from '@/app/scenario/result/components/ScoredBoard'

interface AnswerData {
  id: number
  isCorrect: boolean
  nickname: string
  characterImage: string
  drawingImage: string
}

// 임시 데이터 리스트
const answerData: AnswerData[] = [
  {
    id: 1,
    isCorrect: false,
    nickname: '이구역그림짱은나야',
    characterImage: '/images/tiger.png',
    drawingImage: '/images/drawing.png',
  },
  {
    id: 2,
    isCorrect: true,
    nickname: '햄벅유경',
    characterImage: '/images/rabbit.png',
    drawingImage: '/images/drawing.png',
  },
  {
    id: 3,
    isCorrect: true,
    nickname: '김지허니',
    characterImage: '/images/rabbit.png',
    drawingImage: '/images/drawing.png',
  },
  {
    id: 4,
    isCorrect: true,
    nickname: '핑구핑',
    characterImage: '/images/tiger.png',
    drawingImage: '/images/drawing.png',
  },
  {
    id: 5,
    isCorrect: true,
    nickname: '동원참치',
    characterImage: '/images/tiger.png',
    drawingImage: '/images/drawing.png',
  },
  {
    id: 6,
    isCorrect: false,
    nickname: '아가주호',
    characterImage: '/images/rabbit.png',
    drawingImage: '/images/drawing.png',
  },
  {
    id: 7,
    isCorrect: false,
    nickname: 'hand given tiger',
    characterImage: '/images/tiger.png',
    drawingImage: '/images/drawing.png',
  },
]

export default function ScenarioResultParticipant() {
  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="mb-4 w-2/5 bg-wood bg-cover bg-left text-5xl text-white text-center py-4 rounded-xl shadow-lg">
        작은 불 끄기
      </h2>
      <ScoredBoard
        isCorrect={false}
        nickname="이구역그림짱은나야 (나)"
        characterImage="/images/tiger.png"
        drawingImage="/images/drawing.png"
      />
      <button className="bg-secondary-50 border-2 border-secondary-500 w-full py-3 rounded-xl">
        <p className="text-3xl">억울해요 😢</p>
        <p className="text-xl">
          차례가 되면 마이크를 켜고 의견을 이야기할 수 있어요
        </p>
      </button>
      <div className="grid grid-cols-3 gap-x-6 mt-8">
        {answerData.map((data) => (
          <ScoredBoard
            key={data.id}
            isCorrect={data.isCorrect}
            nickname={data.nickname}
            characterImage={data.characterImage}
            drawingImage={data.drawingImage}
          />
        ))}
      </div>
    </div>
  )
}

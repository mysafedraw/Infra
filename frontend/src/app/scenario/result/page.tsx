import AnswerBoard from '@/app/scenario/result/components/AnswerBoard'

interface AnswerData {
  isCorrect: boolean
  nickname: string
  characterImage: string
  drawingImage: string
}

// 임시 데이터 리스트
const answerData: AnswerData[] = [
  {
    isCorrect: false,
    nickname: '이구역그림짱은나야',
    characterImage: '/images/tiger.png',
    drawingImage: '/images/drawing.png',
  },
  {
    isCorrect: true,
    nickname: '햄벅유경',
    characterImage: '/images/rabbit.png',
    drawingImage: '/images/drawing.png',
  },
  {
    isCorrect: true,
    nickname: '김지허니',
    characterImage: '/images/rabbit.png',
    drawingImage: '/images/drawing.png',
  },
  {
    isCorrect: true,
    nickname: '핑구핑',
    characterImage: '/images/tiger.png',
    drawingImage: '/images/drawing.png',
  },
  {
    isCorrect: true,
    nickname: '동원참치',
    characterImage: '/images/tiger.png',
    drawingImage: '/images/drawing.png',
  },
  {
    isCorrect: false,
    nickname: '아가주호',
    characterImage: '/images/rabbit.png',
    drawingImage: '/images/drawing.png',
  },
  {
    isCorrect: false,
    nickname: 'hand given tiger',
    characterImage: '/images/tiger.png',
    drawingImage: '/images/drawing.png',
  },
]

export default function ScenarioResult() {
  return (
    <div className="p-6 flex flex-col items-center bg-[url('/images/classroom.png')] bg-cover bg-center min-h-screen">
      <h2 className="mb-4 w-[32rem] bg-wood bg-cover bg-left text-5xl text-white text-center py-4 rounded-xl shadow-lg">
        작은 불 끄기
      </h2>
      <AnswerBoard
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
      <div className="grid grid-cols-3 gap-x-4 mt-8">
        {answerData.map((data, index) => (
          <AnswerBoard
            key={index}
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

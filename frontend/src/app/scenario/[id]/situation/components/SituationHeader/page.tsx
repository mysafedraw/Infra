import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ScenarioHeaderProps {
  title: string
  showNextButton?: boolean // 다음으로 버튼 표시 여부
  onNext?: () => void
}

export default function ScenarioHeader({
  title,
  showNextButton = false,
  onNext,
}: ScenarioHeaderProps) {
  const router = useRouter()

  // 방 나가기

  return (
    <div className="flex flex-row items-center justify-between p-4">
      <div className="flex flex-row items-center">
        <Image
          src="/icons/back-arrow.svg"
          alt="back"
          width={60}
          height={60}
          className="h-12 w-auto cursor-pointer pointer-events-auto"
          onClick={() => router.back()}
        />
        <div className="bg-white border-primary-500 border-4 p-4 px-12 rounded-3xl ml-4">
          <h3 className="text-4xl">{title}</h3>
        </div>
      </div>

      {/* 그림 그리기 시작 (방장만) */}
      {showNextButton && onNext && (
        <div className="text-center">
          <button
            className="right-6 flex items-center justify-center"
            onClick={onNext}
          >
            <Image
              src="/images/wood-arrow.png"
              alt="game-start"
              width={241}
              height={88}
              className="h-16 w-auto cursor-pointer pointer-events-auto"
              priority
            />
            <p className="absolute text-white text-4xl shadow-lg pr-2">
              다음으로
            </p>
          </button>
        </div>
      )}
    </div>
  )
}

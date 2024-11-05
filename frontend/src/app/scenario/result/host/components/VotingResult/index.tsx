import Image from 'next/image'
import Chalkboard from '@/app/scenario/result/components/Chalkboard'

interface VotingResultProps {
  onApprove: () => void
  onReject: () => void
}

export default function VotingResult({
  onApprove,
  onReject,
}: VotingResultProps) {
  const isApproved = true // 투표 결과
  const color = isApproved ? 'green' : 'red'

  return (
    <div className="fixed inset-0 z-[300] bg-black bg-opacity-40 backdrop-blur flex items-center justify-center">
      <div className="bg-secondary-100 border-4 border-secondary-400 p-6 rounded-lg shadow-button-active text-center py-12 px-28">
        {/* 결과 제목 */}
        <h2 className="text-5xl mb-2">최종 투표 결과</h2>

        {/* 찬반 결과 메시지 */}
        <p className={`text-4xl mb-4 text-${color}-500`}>
          {isApproved ? '찬성이 많았어요' : '반대가 많았어요'}
        </p>

        <div className="relative flex flex-col items-center">
          <div className="absolute -top-1">
            <Image
              src={
                isApproved ? '/icons/thumbs-up.svg' : '/icons/thumbs-down.svg'
              }
              alt={isApproved ? 'thumbs-up' : 'thumbs-down'}
              width={32}
              height={32}
              className="size-20"
            />
          </div>

          <div
            className={`bg-${color}-100 border-2 border-${color}-300 rounded-3xl py-8 px-10 m-10 mb-8`}
          >
            {/* 칠판 이미지 */}
            <div className="relative flex items-center justify-center w-80 mt-1">
              <Chalkboard drawingImage="/images/drawing.png" />
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <p className="text-3xl mb-6">투표 결과를 승인할까요?</p>

        {/* 승인 및 거절 버튼 */}
        <div className="flex justify-center gap-4 w-full text-4xl">
          <button
            className="w-full py-3 bg-primary-500 text-primary-950 rounded-xl hover:bg-primary-300"
            onClick={onApprove}
          >
            승인
          </button>
          <button
            className="w-full py-3 bg-gray-dark text-text rounded-xl hover:bg-gray-medium"
            onClick={onReject}
          >
            거절
          </button>
        </div>
      </div>
    </div>
  )
}

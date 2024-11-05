import Chalkboard from '@/app/scenario/result/components/Chalkboard'

export default function VotingStatus() {
  const agreePercentage = 60
  const disagreePercentage = 40
  const agreeVotes = 6
  const disagreeVotes = 4

  return (
    <div className="flex flex-col justify-center items-center m-4 w-[36rem]">
      {/* 그림 */}
      <div className="relative flex items-center justify-center w-80 mx-6 mb-4">
        <Chalkboard drawingImage="/images/drawing.png" />
      </div>

      {/* 현황 텍스트 */}
      <div className="mt-2 flex items-center justify-between space-x-4 w-full">
        <span className="text-3xl text-secondary-950">현황</span>

        {/* 투표 현황 막대 그래프 */}
        <div className="relative w-full max-w-lg h-10 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-green-200 border-2 border-r-0 border-green-400 rounded-l-full flex items-center justify-end pr-4"
            style={{ width: `${agreePercentage}%` }}
          >
            <span className="text-2xl text-green-950">
              {agreePercentage}% ({agreeVotes}표)
            </span>
          </div>
          <div
            className="absolute right-0 top-0 h-full bg-red-200 border-2 border-red-400 rounded-r-full flex items-center justify-start pl-4"
            style={{ width: `${disagreePercentage}%` }}
          >
            <span className="text-2xl text-red-950">
              {disagreePercentage}% ({disagreeVotes}표)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

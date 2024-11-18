import Chalkboard from '@/app/scenario/result/components/Chalkboard'
import { useEffect, useState } from 'react'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useUser } from '@/app/_contexts/UserContext'

export default function VotingStatus({ drawing }: { drawing: string }) {
  const { user } = useUser()
  const { registerCallback } = useWebSocketContext()
  const [agreeVotes, setAgreeVotes] = useState(0)
  const [disagreeVotes, setDisagreeVotes] = useState(0)

  // 누표 현황 (비율) 계산
  const totalVotes = agreeVotes + disagreeVotes
  const agreePercentage = totalVotes
    ? Math.round((agreeVotes / totalVotes) * 100)
    : 0
  const disagreePercentage = totalVotes
    ? Math.round((disagreeVotes / totalVotes) * 100)
    : 0

  useEffect(() => {
    const userId = user?.userId
    registerCallback(`/games/${userId}`, 'VOTE', (message) => {
      const { proCount, conCount } = message

      setAgreeVotes(proCount)
      setDisagreeVotes(conCount)
    })
  }, [registerCallback, user?.userId])

  return (
    <div className="flex flex-col justify-center items-center m-4 w-[36rem]">
      {/* 그림 */}
      <div className="relative flex items-center justify-center w-80 mx-6 mb-4">
        <Chalkboard drawingImage={drawing} />
      </div>

      {/* 현황 텍스트 */}
      <div className="mt-2 flex items-center justify-between space-x-4 w-full">
        <span className="text-3xl text-secondary-950">현황</span>

        {/* 투표 현황 막대 그래프 */}
        <div className="relative w-full max-w-lg h-10 overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full bg-green-200 border-2 border-green-400 flex items-center justify-end pr-4 
              ${agreeVotes > 0 && disagreeVotes === 0 ? 'rounded-full' : 'rounded-l-full'}
              ${agreeVotes === 0 && disagreeVotes > 0 ? 'hidden' : ''}`}
            style={{
              width: `${agreeVotes === 0 && disagreeVotes === 0 ? 50 : agreePercentage}%`,
            }}
          >
            <span className="text-2xl text-green-950">
              {agreePercentage}% ({agreeVotes}표)
            </span>
          </div>
          <div
            className={`absolute right-0 top-0 h-full bg-red-200 border-2 border-red-400 flex items-center justify-start pl-4 
              ${disagreeVotes > 0 && agreeVotes === 0 ? 'rounded-full' : 'rounded-r-full'}
              ${disagreeVotes === 0 && agreeVotes > 0 ? 'hidden' : ''}`}
            style={{
              width: `${agreeVotes === 0 && disagreeVotes === 0 ? 50 : disagreePercentage}%`,
            }}
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

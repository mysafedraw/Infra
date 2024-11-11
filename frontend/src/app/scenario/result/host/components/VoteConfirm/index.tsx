import Image from 'next/image'
import Chalkboard from '@/app/scenario/result/components/Chalkboard'
import { useEffect, useState } from 'react'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import Spinner from '/public/icons/spinner.svg'
import { useUser } from '@/app/_contexts/UserContext'

interface VoteConfirmProps {
  onClose: () => void
}

export default function VoteConfirm({ onClose }: VoteConfirmProps) {
  const { user } = useUser()
  const { sendMessage, registerCallback } = useWebSocketContext()
  const [isPassed, setIsPassed] = useState(false)
  const [drawingSrc, setDrawingSrc] = useState('/images/drawing.png')
  const [isLoading, setIsLoading] = useState(true)
  const [roomId, setRoomId] = useState<string | null>(null)

  const color = isPassed ? 'green' : 'red'
  const userId = 'user1' // 현재 투표중인 애 userId

  useEffect(() => {
    const hostId = user?.userId
    setRoomId(localStorage.getItem('roomId'))

    if (hostId) {
      registerCallback(`/games/${hostId}`, 'END_VOTE', (message) => {
        setIsPassed(message.isPassed)
        setDrawingSrc(message.drawingSrc)
        setIsLoading(false)
      })
    } else {
      console.warn('Host userId가 localStorage에 없습니다.')
    }
  }, [registerCallback, user?.userId])

  const handleApprove = () => {
    const message = JSON.stringify({
      userId,
      roomId,
      isConfirmed: true,
    })
    sendMessage('/games/confirm', message)
    onClose()
  }

  const handleReject = () => {
    const message = JSON.stringify({
      userId,
      isConfirmed: false,
    })
    sendMessage('/games/confirm', message)
    onClose()
  }

  if (isLoading) {
    // 로딩 중일 때 표시할 컴포넌트
    return (
      <div className="fixed inset-0 z-[300] bg-black bg-opacity-40 backdrop-blur flex items-center justify-center">
        <div className="bg-secondary-100 border-4 border-secondary-400 p-6 rounded-lg shadow-button-active text-center text-secondary-950 py-12 px-28">
          <Spinner className="inline mb-4 size-10" />
          <p className="text-3xl">투표 결과를 불러오고 있어요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black bg-opacity-40 backdrop-blur flex items-center justify-center">
      <div className="bg-secondary-100 border-4 border-secondary-400 p-6 rounded-lg shadow-button-active text-center py-12 px-28">
        {/* 결과 제목 */}
        <h2 className="text-5xl mb-2">최종 투표 결과</h2>

        {/* 찬반 결과 메시지 */}
        <p className={`text-4xl mb-4 text-${color}-500`}>
          {isPassed ? '찬성이 많았어요' : '반대가 많았어요'}
        </p>

        <div className="relative flex flex-col items-center">
          <div className="absolute -top-1">
            <Image
              src={isPassed ? '/icons/thumbs-up.svg' : '/icons/thumbs-down.svg'}
              alt={isPassed ? 'thumbs-up' : 'thumbs-down'}
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
              <Chalkboard drawingImage={drawingSrc} />
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <p className="text-3xl mb-6">투표 결과를 승인할까요?</p>

        {/* 승인 및 거절 버튼 */}
        <div className="flex justify-center gap-4 w-full text-4xl">
          <button
            onClick={handleApprove}
            className="w-full py-3 bg-primary-500 text-primary-950 rounded-xl hover:bg-primary-300"
          >
            승인
          </button>
          <button
            onClick={handleReject}
            className="w-full py-3 bg-gray-dark text-text rounded-xl hover:bg-gray-medium"
          >
            거절
          </button>
        </div>
      </div>
    </div>
  )
}

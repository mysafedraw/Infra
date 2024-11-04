'use client'

import AnswerBoard from '@/app/scenario/result/components/AnswerBoard'
import { useEffect, useState } from 'react'
import MicIcon from '/public/icons/microphone.svg'

interface ExplainQueueBoardProps {
  id: number
  nickname: string
  characterImage: string
  drawingImage: string
}

export default function ExplainQueueBoard({
  id,
  nickname,
  characterImage,
  drawingImage,
}: ExplainQueueBoardProps) {
  const [volume, setVolume] = useState(0)

  useEffect(() => {
    // 랜덤하게 volume 상태 변경
    const interval = setInterval(() => {
      setVolume(Math.floor(Math.random() * 101)) // 0 ~ 100 사이의 값
    }, 500)

    return () => clearInterval(interval) // 컴포넌트 언마운트 시 interval 해제
  }, [])

  return (
    <div className="relative">
      {id === 1 ? (
        <div className="z-10 absolute top-0 -left-1 px-5 py-2 rounded-lg border-4 border-primary-500 bg-white">
          <div className="relative">
            {/* 회색 마이크 아이콘 */}
            <MicIcon className="w-11 h-11 fill-gray-dark stroke-gray-dark" />

            {/* 컬러 마이크 아이콘 */}
            <div
              className="absolute w-full overflow-hidden"
              style={{ height: `${volume}%`, bottom: 0 }} // 채워지는 높이를 volume으로 설정
            >
              <MicIcon className="w-11 h-11 fill-primary-500 stroke-primary-500 absolute bottom-0" />
            </div>
          </div>
        </div>
      ) : (
        <div className="z-10 absolute top-0 -left-1 bg-white px-5 py-2 rounded-lg border-2 border-gray-medium">
          <MicIcon className="w-11 h-11 fill-gray-dark stroke-gray-dark" />
        </div>
      )}
      <AnswerBoard
        nickname={nickname}
        characterImage={characterImage}
        drawingImage={drawingImage}
      />
    </div>
  )
}

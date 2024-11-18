'use client'

import AnswerBoard from '@/app/scenario/result/components/AnswerBoard'
import MicIcon from '/public/icons/microphone.svg'
import { AnswerData } from '@/app/scenario/result/types/answerTypes'
import VolumeMicIcon from '@/app/scenario/result/components/VolumeMicIcon'
import { useSpeakingRight } from '@/app/_contexts/SpeakingRight'

interface ExplainQueueBoardProps {
  data: AnswerData
}

export default function ExplainQueueBoard({ data }: ExplainQueueBoardProps) {
  const { id, nickname, characterImage, drawingImage } = data
  const { speakingRightInfo } = useSpeakingRight()

  return (
    <div className="relative min-w-max">
      {speakingRightInfo?.userId === id ? (
        <div className="z-10 absolute top-0-1 -left-1 px-5 py-2 rounded-lg border-4 border-primary-500 bg-white">
          <VolumeMicIcon />
        </div>
      ) : (
        <div className="z-10 absolute top-0 -left-1 bg-white px-5 py-2 rounded-lg border-2 border-gray-medium">
          <MicIcon className="w-11 h-11 fill-gray-dark stroke-gray-dark" />
        </div>
      )}
      <AnswerBoard
        id={id}
        nickname={nickname}
        characterImage={characterImage}
        drawingImage={drawingImage}
        shouldBlink={false}
      />
    </div>
  )
}

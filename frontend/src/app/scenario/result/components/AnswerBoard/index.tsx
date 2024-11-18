import Image from 'next/image'
import Chalkboard from '@/app/scenario/result/components/Chalkboard'
import { useSpeakingRight } from '@/app/_contexts/SpeakingRight'
import VolumeMicIcon from '@/app/scenario/result/components/VolumeMicIcon'

interface AnswerBoardProps {
  id: string
  nickname: string
  characterImage: string
  drawingImage: string
  shouldBlink?: boolean
}

export default function AnswerBoard({
  id,
  nickname,
  characterImage,
  drawingImage,
  shouldBlink = true,
}: AnswerBoardProps) {
  const { speakingRightInfo } = useSpeakingRight()

  const hasSpeakingRight = speakingRightInfo?.userId === id

  return (
    <div className="relative flex items-center justify-center m-2 mt-8 max-w-[26rem]">
      <Chalkboard drawingImage={drawingImage} />

      {/*발언 중일 때, 아닐 때 구분해서 표시*/}
      <div className="absolute -top-7 right-0 flex items-center justify-center w-56 h-16 z-10">
        {shouldBlink && hasSpeakingRight && (
          <div className="animate-small-ping absolute inline-flex w-full h-full bg-primary-500 rounded-lg opacity-75"></div>
        )}
        <div
          className={`relative inline-flex justify-center items-center border-2 w-56 h-11 text-2xl rounded-lg ${hasSpeakingRight ? 'bg-primary-300 border-primary-600' : 'bg-primary-50 border-primary-300'}`}
        >
          {nickname}
        </div>
      </div>

      <div className="absolute -bottom-3 -right-3">
        <Image
          src={characterImage}
          alt="character"
          width={128}
          height={176}
          className="h-44 w-auto object-contain"
        />
      </div>

      {/* 발언 중일 때 마이크 표시 */}
      {hasSpeakingRight && shouldBlink && (
        <div className="absolute left-8 bottom-8">
          <VolumeMicIcon />
        </div>
      )}
    </div>
  )
}

import Image from 'next/image'

interface AnswerBoardProps {
  id: number
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
  return (
    <div className="relative flex items-center justify-center m-2 mt-8 max-w-full">
      <Image
        src="/images/blackboard.png"
        alt="blackboard"
        width={898}
        height={488}
        className="max-w-[26rem] h-auto"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={drawingImage}
          alt="drawing"
          width={135}
          height={131}
          className="h-3/5 w-auto object-contain"
        />
      </div>

      {/*발언 중일 때, 아닐 때 구분해서 표시*/}
      <div className="absolute -top-7 right-0 flex items-center justify-center w-56 h-16 z-10">
        {shouldBlink && id === 1 && (
          <div className="animate-small-ping absolute inline-flex w-full h-full bg-primary-500 rounded-lg opacity-75"></div>
        )}
        <div
          className={`relative inline-flex justify-center items-center border-2 w-56 h-11 text-2xl rounded-lg ${id === 1 ? 'bg-primary-300 border-primary-600' : 'bg-primary-50 border-primary-300'}`}
        >
          {nickname}
        </div>
      </div>

      <div className="absolute -bottom-3 -right-3">
        <Image
          src={characterImage}
          alt="character"
          width={435}
          height={574}
          className="w-32 object-contain"
        />
      </div>
    </div>
  )
}

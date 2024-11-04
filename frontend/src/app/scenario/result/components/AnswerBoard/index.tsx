import Image from 'next/image'

interface AnswerBoardProps {
  nickname: string
  characterImage: string
  drawingImage: string
}

export default function AnswerBoard({
  nickname,
  characterImage,
  drawingImage,
}: AnswerBoardProps) {
  return (
    <div className="relative flex items-center justify-center m-2 mt-6 max-w-full">
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

      <div className="absolute -top-4 right-0 bg-primary-50 border-2 border-primary-300 w-[14rem] text-2xl text-center py-1 rounded-lg">
        {nickname}
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

interface BlinkingNameTagProps {
  id: number
  nickname: string
}

export default function BlinkingNameTag({
  id,
  nickname,
}: BlinkingNameTagProps) {
  return (
    <div className="absolute -top-7 right-0 flex items-center justify-center w-56 h-16 z-50">
      {id === 1 && (
        <div className="animate-small-ping absolute inline-flex w-full h-full bg-primary-500 rounded-lg opacity-75"></div>
      )}
      <div
        className={`relative inline-flex justify-center items-center border-2 w-56 h-11 text-2xl rounded-lg ${
          id === 1
            ? 'bg-primary-300 border-primary-600'
            : 'bg-primary-50 border-primary-300'
        }`}
      >
        {nickname}
      </div>
    </div>
  )
}

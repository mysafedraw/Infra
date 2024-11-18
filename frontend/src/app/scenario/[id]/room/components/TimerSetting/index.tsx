import Image from 'next/image'
import MinusIcon from '/public/icons/minus.svg'
import PlusIcon from '/public/icons/plus.svg'

export default function TimerSetting({
  time,
  onTimeChange,
}: {
  time: number
  onTimeChange: (newTime: number) => void
}) {
  return (
    <div className="relative">
      <Image
        src="/images/sketchbook.png"
        alt="sketchbook-timer"
        width={240}
        height={100}
        className="rounded-lg object-cover"
      />
      {/* 제목 */}
      <div className="absolute inset-0 flex flex-col pt-12 px-6">
        <h3 className="text-center text-2xl mb-2">그림 그리는 시간</h3>
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => onTimeChange(Math.max(10, time - 10))}
            className="w-8 h-8 mt-1"
          >
            <MinusIcon />
          </button>
          <span className="text-3xl">{time}초</span>
          <button
            onClick={() => onTimeChange(Math.min(120, time + 10))}
            className="w-8 h-8"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

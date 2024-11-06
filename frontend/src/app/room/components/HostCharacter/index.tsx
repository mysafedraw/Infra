import { Host } from '@/app/room/types/studentType'
import CrownIcon from '/public/icons/crown.svg'
import Image from 'next/image'

export default function HostCharacter({ host }: { host: Host }) {
  return (
    <div className="w-1/4 flex flex-col items-center justify-center rounded-lg p-3 relative">
      {/* 왕관 아이콘 */}
      <div className="absolute -top-1 left-8">
        <CrownIcon className="w-8 h-8" />
      </div>
      <div className="flex flex-col items-center">
        <Image
          src="/images/tiger.png"
          alt="teacher"
          width={200}
          height={200}
          className="w-32 h-auto relative z-10"
        />
        {/* 타원 받침대  */}
        <div className="relative -mt-12">
          <div
            className="w-[200px] h-[80px] bg-primary-400 opacity-40 absolute top-1"
            style={{ clipPath: 'ellipse(90px 15px)' }}
          />
          <div
            className="w-[200px] h-[80px] bg-primary-300 relative"
            style={{ clipPath: 'ellipse(90px 15px)' }}
          />
        </div>
        <p className="text-center text-xl font-medium -mt-4 select-none">
          {host.nickname}
        </p>
      </div>
    </div>
  )
}

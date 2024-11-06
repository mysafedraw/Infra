import Image from 'next/image'
import Chalkboard from '@/app/scenario/result/components/Chalkboard'

export default function VoteAction() {
  return (
    <div className="flex justify-around items-center m-4 w-[36rem]">
      {/* 찬성 버튼 */}
      <button className="flex items-center justify-center p-2 bg-green-100 border-2 border-green-300 rounded-3xl">
        <Image
          src="/icons/thumbs-up.svg"
          alt="thumbs-up"
          width={32}
          height={32}
          className="size-20"
        />
      </button>
      {/* 그림 */}
      <div className="relative flex items-center justify-center w-80 mx-6">
        <Chalkboard drawingImage="/images/drawing.png" />
      </div>
      {/* 반대 버튼 */}
      <button className="flex items-center justify-center p-2 bg-red-100 border-2 border-red-300 rounded-3xl">
        <Image
          src="/icons/thumbs-down.svg"
          alt="thumbs-down"
          width={32}
          height={32}
          className="size-20"
        />
      </button>
    </div>
  )
}

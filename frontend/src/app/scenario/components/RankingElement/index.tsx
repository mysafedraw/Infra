import Image from 'next/image'

export default function RankingElement({ rank }: { rank: number }) {
  return (
    <li className="flex border-[5px] border-white rounded-full bg-[rgba(255,255,255,0.8)] overflow-hidden h-16 items-center justify-between pr-7">
      <div className="flex w-full h-full items-center">
        <span className=" rounded-full aspect-square text-4xl bg-primary-800 flex justify-center items-center text-white h-full mr-2">
          {rank}
        </span>
        <p className="relative h-full aspect-square mr-3">
          <span className="absolute top-2">
            <Image
              src="/images/tiger.png"
              alt="user-character"
              width={70}
              height={40}
              priority
            />
          </span>
        </p>
        <span className="text-2xl text-text">2학년 1반 김유경</span>
      </div>
      <span className="whitespace-nowrap text-3xl text-primary-950">200점</span>
    </li>
  )
}

import Image from 'next/image'
import RankingBox from '@/app/scenario/components/RankingBox'
import Medal1 from '/public/icons/1st-place-medal.svg'
import Medal2 from '/public/icons/2nd-place-medal.svg'
import Medal3 from '/public/icons/3rd-place-medal.svg'
import RankingElement from '@/app/scenario/components/RankingElement'

const RANKING_BOXES = [
  {
    height: 'h-72',
    ranking: (
      <Medal2 className="w-36 absolute z-10 -top-24 left-1/2 -translate-x-1/2" />
    ),
    score: 888,
    user: '2학년 1반 김유경',
    border: 'border-r-0',
    profileSize: 120,
  },
  {
    height: 'h-80',
    ranking: (
      <Medal1 className="w-40 absolute z-10 -top-28 left-1/2 -translate-x-1/2" />
    ),
    score: 999,
    user: '2학년 1반 김유경',
    profileSize: 179,
  },
  {
    height: 'h-72',
    ranking: (
      <Medal3 className="w-32 absolute z-10 -top-20 left-1/2 -translate-x-1/2" />
    ),
    score: 777,
    user: '2학년 1반 김유경',
    border: 'border-l-0',
    profileSize: 89,
  },
]

export default function ScenarioRanking() {
  return (
    <section className="bg-secondary-500 min-h-screen w-full flex flex-col items-center gap-48 pb-20 overflow-hidden">
      <header className="w-full h-48 relative">
        <button className="absolute right-6 top-11 flex items-center justify-center z-10">
          <Image
            src="/images/wood-arrow.png"
            alt="finish-button"
            width={241}
            height={88}
            className="h-20 w-auto"
          />
          <p className="absolute text-white text-4xl shadow-lg pr-2">
            방 나가기
          </p>
        </button>
        <Image
          src="/images/map.png"
          alt="scenario"
          layout="fill"
          objectFit="cover"
          priority
        />
      </header>
      <main className="flex flex-col gap-9 items-center max-w-[68rem] w-full px-7">
        <section className="flex items-end">
          {RANKING_BOXES.map((rankingInfo) => {
            return (
              <RankingBox
                key={rankingInfo.user}
                height={rankingInfo.height}
                ranking={rankingInfo.ranking}
                score={rankingInfo.score}
                user={rankingInfo.user}
                border={rankingInfo.border}
                profileSize={rankingInfo.profileSize}
              />
            )
          })}
        </section>
        <ul className="flex flex-col gap-5 w-full">
          {new Array(8)
            .fill(0)
            .map((_, index) => index + 4)
            .map((rank) => {
              return <RankingElement key={rank} rank={rank} />
            })}
        </ul>
      </main>
    </section>
  )
}

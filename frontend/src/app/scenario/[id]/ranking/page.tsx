'use client'

import Image from 'next/image'
import RankingBox from '@/app/scenario/components/RankingBox'
import Medal1 from '/public/icons/1st-place-medal.svg'
import Medal2 from '/public/icons/2nd-place-medal.svg'
import Medal3 from '/public/icons/3rd-place-medal.svg'
import RankingElement from '@/app/scenario/components/RankingElement'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import Confetti from '@/app/lib/Confetti'
import { useUser } from '@/app/_contexts/UserContext'
import { useRouter } from 'next/navigation'

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

interface Rank {
  avatarsImgSrc?: string
  nickname: string
  rank: number
  score: number
  userId: string
}

interface RankMessage {
  action: string
  users: Rank[]
}

export default function ScenarioRanking() {
  const router = useRouter()
  const { user } = useUser()
  const [ranks, setRanks] = useState<Rank[]>([])
  const { isConnected, sendMessage, registerCallback } = useWebSocketContext()

  useEffect(() => {
    const roomId = localStorage.getItem('roomId')

    registerCallback(
      `/games/${roomId}`,
      'FINAL_RANK',
      (message: RankMessage) => {
        const rankLength = message.users.length

        if (rankLength >= 3) {
          setRanks(message.users)
        } else {
          const getRank = message.users

          new Array(3 - rankLength)
            .fill(0)
            .map((_, index) => rankLength + index + 1)
            .forEach((rank) => {
              getRank.push({
                avatarsImgSrc: '',
                nickname: '',
                rank,
                score: 0,
                userId: '',
              })
            })

          const rank2 = getRank[1]
          const rank1 = getRank[0]
          getRank[1] = rank1
          getRank[0] = rank2

          setRanks(getRank)
        }
      },
    )

    if (isConnected) {
      sendMessage(
        '/games/rank',
        JSON.stringify({
          roomId,
        }),
      )
    } else {
      console.error('소켓 연결 실패')
    }
  }, [isConnected])

  // 방 나가기 -> 1. 소켓방 나가기, 2. 대기방으로 나가기
  const handleLeaveRoom = () => {
    const roomId = localStorage.getItem('roomId')
    registerCallback(`/rooms/${roomId}`, 'LEAVE_ROOM', () => {
      localStorage.removeItem('roomId')
      router.push(`/scenario`)
    })

    sendMessage(
      '/rooms/leave',
      JSON.stringify({ roomId: roomId, userId: user?.userId }),
    )
  }

  useEffect(() => {
    Confetti()
  }, [])

  return (
    <section className="bg-secondary-500 min-h-screen w-full flex flex-col items-center gap-48 pb-20 overflow-hidden">
      <header className="w-full h-48 relative">
        <button
          className="absolute right-6 top-11 flex items-center justify-center z-10"
          onClick={handleLeaveRoom}
        >
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
          {ranks.map((rank, index) => {
            return (
              <RankingBox
                key={rank.userId}
                height={RANKING_BOXES[index].height}
                ranking={RANKING_BOXES[index].ranking}
                score={rank.score}
                user={rank.nickname}
                character={rank.avatarsImgSrc}
                border={RANKING_BOXES[index].border}
                profileSize={RANKING_BOXES[index].profileSize}
              />
            )
          })}
        </section>
        <ul className="flex flex-col gap-5 w-full">
          {ranks.length > 3
            ? ranks.slice(3).map((rank) => {
                return (
                  <RankingElement
                    key={rank.userId}
                    rank={rank.rank}
                    nickname={rank.nickname}
                    score={rank.score}
                  />
                )
              })
            : null}
        </ul>
      </main>
    </section>
  )
}

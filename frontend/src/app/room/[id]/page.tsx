'use client'

import Image from 'next/image'
import ChatBox from '@/app/_components/ChatBox'
import StudentGroup from '@/app/room/components/StudentGroup'
import { Host, Student } from '@/app/room/types/studentType'
import TimerSetting from '@/app/room/components/TimerSetting'
import HostCharacter from '@/app/room/components/HostCharacter'

interface RoomResponse {
  userId: string
  roomId: string
  host: Host
  currentPlayers: Student[]
}

const mockData: RoomResponse = {
  userId: 'user123',
  roomId: 'room001',
  host: {
    userId: 'host001',
    nickname: '2학년 1반 담임 권동원',
  },
  currentPlayers: [
    { userId: 'player001', nickname: '2학년 1반 김지윤' },
    { userId: 'player002', nickname: '2학년 1반 손준범' },
    { userId: 'player003', nickname: '2학년 1반 이주호' },
    { userId: 'player004', nickname: '2학년 1반 김혜인' },
    { userId: 'player005', nickname: '2학년 1반 김유경' },
    { userId: 'player006', nickname: '2학년 1반 김지윤' },
    { userId: 'player007', nickname: '2학년 1반 손준범' },
    { userId: 'player008', nickname: '2학년 1반 이주호' },
    { userId: 'player009', nickname: '2학년 1반 김혜인' },
    { userId: 'player010', nickname: '2학년 1반 김유경' },
  ],
}

export default function Room() {
  const isHost = true
  const speech = '여러분, 화재 상황에 대해 \n잘 배워보아요 ^^'

  return (
    <div className="w-full min-h-screen bg-secondary-500 p-6 flex flex-col">
      <div className="h-[10%] flex justify-between items-center">
        {/* 나가기 */}
        <div className="flex items-center drop-shadow-md mb-10">
          <Image
            src="/icons/back-arrow.svg"
            alt="back"
            width={30}
            height={30}
            className="h-10 w-auto"
          />
          <h1 className="ml-6 text-4xl text-white">나가기</h1>
        </div>
        {/* 참여 인원 */}
        <div className="bg-white px-6 py-1.5 rounded-lg border-2 border-primary-500">
          <span className="text-4xl text-text">참여 인원: 9 / 30</span>
        </div>
        {/* 게임 시작 (방장만) */}
        {isHost && (
          <div className="text-center">
            <button className="right-6 flex items-center justify-center">
              <Image
                src="/images/wood-arrow.png"
                alt="game-start"
                width={241}
                height={88}
                className="h-16 w-auto"
                priority
              />
              <p className="absolute text-white text-4xl shadow-lg pr-2">
                게임시작
              </p>
            </button>
          </div>
        )}
      </div>
      <div className="h-[30%] flex gap-6 my-3 items-center justify-between">
        {/* 시나리오 이미지 */}
        <div className="relative w-[350px] h-[200px] rounded-lg overflow-hidden">
          <Image
            src="/images/fire_event.png"
            alt="화재 상황"
            fill
            className="object-cover"
          />
        </div>
        {/* 방장 캐릭터 */}
        <HostCharacter host={mockData.host} />
        {!isHost && (
          <div className="-ml-16">
            <div className="relative bg-white p-6 rounded-2xl shadow-md">
              {/* 왼쪽 중앙 꼬리 모양 */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4"
                style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
                }}
              />
              <p className="text-2xl whitespace-pre-wrap select-none">
                {speech}
              </p>
            </div>
          </div>
        )}
        {/* 그림 그리는 시간 설정(방장) */}
        <div
          className={`flex items-center justify-center ${isHost ? 'w-[350px]' : 'w-[100px]'}`}
        >
          {isHost && <TimerSetting />}
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        {/* 학생 목록 */}
        <div className="flex-1">
          <StudentGroup students={mockData.currentPlayers} />
        </div>
        {/* 채팅 */}
        <div className="w-[350px]">
          <ChatBox />
        </div>
      </div>
    </div>
  )
}

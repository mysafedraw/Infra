'use client'

import Image from 'next/image'
import ChatBox from '@/app/_components/ChatBox'
import StudentGroup from '@/app/scenario/[id]/room/components/StudentGroup'
import { Host, Student } from '@/app/scenario/[id]/room/types/studentType'
import TimerSetting from '@/app/scenario/[id]/room/components/TimerSetting'
import HostCharacter from '@/app/scenario/[id]/room/components/HostCharacter'
import { useEffect, useState } from 'react'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useParams, useRouter } from 'next/navigation'
import LoadingScreen from '@/app/_components/LoadingScreen'
import { useUser } from '@/app/_contexts/UserContext'
import { useLiveKit } from '@/app/_contexts/LiveKitContext'

interface RoomResponse {
  action: 'ENTER_ROOM'
  host: Host
  currentPlayers: Student[]
}

interface GameStartResponse {
  action: 'GAME_START'
  situationDialogue: string
}

export default function Room() {
  const speech = '여러분, 화재 상황에 대해 \n잘 배워보아요 ^^'

  const router = useRouter()
  const { roomId: rawRoomId } = useParams()
  const roomId = Array.isArray(rawRoomId) ? rawRoomId[0] : rawRoomId || ''
  const { user } = useUser()
  const {
    client,
    isConnected,
    sendMessage,
    registerCallback,
    initializeWebSocket,
  } = useWebSocketContext()

  const [roomData, setRoomData] = useState<RoomResponse>()
  const [isInitialized, setIsInitialized] = useState(false)

  const [time, setTime] = useState(30)

  // 게임 시작 응답 처리
  const handleGameStartResponse = (response: GameStartResponse) => {
    console.log(response)
    if (response.action === 'GAME_START') {
      // Situation 페이지로 이동
      router.push(`/scenario/1/situation/step1`)
      // 스테이지 넘버 저장
      localStorage.setItem('stageNumber', '1')
    }
  }

  // 방 정보 설정
  const handleReceivedMessage = (message: RoomResponse) => {
    console.log(message)
    setRoomData(message)
  }

  // 방 입장
  const handleJoinRoom = async () => {
    if (!client?.connected || !roomId) return

    try {
      // localStorage 저장
      localStorage.setItem('roomId', roomId)

      // WebSocket 재초기화
      await initializeWebSocket()

      // 방 데이터 콜백 등록
      registerCallback(`/rooms/${roomId}`, 'ENTER_ROOM', handleReceivedMessage)

      // 콜백 등록
      registerCallback(
        `/games/${roomId}`,
        'GAME_START',
        handleGameStartResponse,
      )

      const subscribeRequest = {
        userId: user?.userId,
        roomId: roomId,
      }

      // 방 입장 요청 전송
      sendMessage(`/rooms/join`, JSON.stringify(subscribeRequest))

      setIsInitialized(true)
    } catch (error) {
      console.error('방 초기화 중 오류 발생:', error)
    }
  }

  // 게임 시작
  const handleGameStart = () => {
    const startRequest = {
      roomId: roomId,
      stageNumber: 1,
      timeLimit: time,
    }

    sendMessage('/games/start', JSON.stringify(startRequest))
  }

  // 방 입장
  useEffect(() => {
    console.log(`roomId : ${roomId}`)
    console.log(`client 있나요 : ${client} isConnected는요 ${isConnected}`)
    if (isConnected && !isInitialized && roomId) {
      handleJoinRoom()
    }
  }, [isConnected, isInitialized, roomId])

  if (!roomData || !isInitialized || !roomId) {
    return <LoadingScreen />
  }

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
          <span className="text-4xl text-text">
            참여 인원: {roomData?.currentPlayers.length + 1} / 30
          </span>
        </div>
        {/* 게임 시작 (방장만) */}
        {user?.isHost && (
          <div className="text-center">
            <button
              className="right-6 flex items-center justify-center"
              onClick={handleGameStart}
            >
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
            priority
          />
        </div>
        {/* 방장 캐릭터 */}
        <HostCharacter host={roomData?.host} />
        {!user?.isHost && (
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
          className={`flex items-center justify-center ${user?.isHost ? 'w-[350px]' : 'w-[100px]'}`}
        >
          {user?.isHost && <TimerSetting time={time} onTimeChange={setTime} />}
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        {/* 학생 목록 */}
        <div className="flex-1">
          <StudentGroup students={roomData?.currentPlayers} />
        </div>
        {/* 채팅 */}
        <div className="w-[350px]">
          <ChatBox />
        </div>
      </div>
    </div>
  )
}

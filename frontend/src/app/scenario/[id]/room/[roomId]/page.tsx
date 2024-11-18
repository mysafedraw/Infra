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
import BackArrowIcon from '/public/icons/back-arrow.svg'
import CommonToast from '@/app/_components/CommonToast'
import { useToast } from '@/app/_hooks/useToast'

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
    unregisterCallback,
    initializeWebSocket,
  } = useWebSocketContext()

  const [roomData, setRoomData] = useState<RoomResponse>()
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast, showToast, hideToast } = useToast(1000)
  const [time, setTime] = useState(30)

  // 게임 시작 응답 처리
  const handleGameStartResponse = (response: GameStartResponse) => {
    if (response.action === 'GAME_START') {
      // Situation 페이지로 이동
      router.push(`/scenario/1/situation/step1`)
      // 스테이지 넘버 저장
      localStorage.setItem('stageNumber', '1')

      // 시작 문장 저장
      localStorage.setItem('situationDialogue', response?.situationDialogue)
    }
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
      registerCallback(
        `/rooms/${roomId}`,
        'ENTER_ROOM',
        (message: RoomResponse) => {
          setRoomData(message)
        },
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

  // 게임 시작 콜백 등록 & 제거
  useEffect(() => {
    const destination = `/games/${roomId}`
    const action = 'GAME_START'

    registerCallback(destination, action, handleGameStartResponse)

    return () => {
      unregisterCallback(destination, action)
    }
  }, [registerCallback, unregisterCallback])

  // 게임 시작
  const handleGameStart = () => {
    // 참여 인원이 1명 이하인 경우 토스트 표시
    if (roomData?.currentPlayers.length === 0) {
      showToast('게임 참여자가 1명 이상인 경우에\n 시작이 가능합니다', {
        imageSrc: '/images/tiger.png',
      })
      return
    }

    const startRequest = {
      roomId: roomId,
      stageNumber: 1,
      timeLimit: time,
    }

    sendMessage('/games/start', JSON.stringify(startRequest))
  }

  // 방 입장
  useEffect(() => {
    if (isConnected && !isInitialized && roomId) {
      handleJoinRoom()
    }
  }, [isConnected, isInitialized, roomId])

  if (!roomData || !isInitialized || !roomId) {
    return <LoadingScreen />
  }

  // 방 나가기
  const handleLeaveRoom = () => {
    // 콜백 등록
    registerCallback(`/rooms/${roomId}`, 'LEAVE_ROOM', () => {
      localStorage.removeItem('roomId')
      router.push(`/scenario`)
    })

    sendMessage(
      '/rooms/leave',
      JSON.stringify({ roomId: roomId, userId: user?.userId }),
    )
  }

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    showToast('방 번호가 복사되었습니다', { isBackGround: false, imageSrc: '' })
  }

  return (
    <div className="w-full min-h-screen bg-secondary-500 p-6 flex flex-col">
      <div className="h-[10%] flex justify-between items-center">
        {/* 나가기 */}
        <button
          className="flex items-center drop-shadow-md mb-10 hover:-translate-x-3 transition-all duration-400 ease-in-out cursor-pointer"
          onClick={handleLeaveRoom}
        >
          <BackArrowIcon />
          <h1 className="ml-6 text-4xl text-white">나가기</h1>
        </button>
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
          {user?.isHost && (
            <div className="flex flex-col justify-center">
              <TimerSetting time={time} onTimeChange={setTime} />
              <div className="text-center flex justify-center w-fit mt-4 relative">
                <Image
                  src="/images/crayon.png"
                  alt="crayon-roomId"
                  width={230}
                  height={100}
                  priority
                />
                <div
                  className="absolute inset-0 left-12 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleCopyRoomId}
                  title="복사하기"
                >
                  <p className="text-2xl font-medium">
                    방 번호: <span className="hover:underline">{roomId}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        {/* 학생 목록 */}
        <div className="flex-1">
          <StudentGroup students={roomData?.currentPlayers} />
        </div>
        {/* 채팅 */}
        <div className="w-[350px] h-[452px]">
          <ChatBox />
        </div>
      </div>
      {toast.isVisible && (
        <CommonToast
          message={toast.message}
          duration={toast.duration}
          imageSrc={toast.imageSrc}
          isBackGround={toast.isBackGround}
          handleDurationEnd={hideToast}
        />
      )}
    </div>
  )
}

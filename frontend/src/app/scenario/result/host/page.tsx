'use client'

import VotingSidebar from '@/app/scenario/result/components/VotingSidebar'
import AllAnswers from '@/app/scenario/result/components/AllAnswers'
import WaitingQueue from '@/app/scenario/result/host/components/WaitingQueue'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import NextStepButton from '@/app/scenario/result/host/components/NextStepButton'
import { useUser } from '@/app/_contexts/UserContext'
import { useLiveKit } from '@/app/_contexts/LiveKitContext'

export default function ScenarioResultHost() {
  const [toastMessage, setToastMessage] = useState<string>('')
  const [isVoiceRoomJoined, setIsVoiceRoomJoined] = useState(false)
  const { registerCallback } = useWebSocketContext()
  const { user } = useUser()
  const { joinVoiceRoom, toggleMicrophone, isMuted } = useLiveKit()
  const [roomId, setRoomId] = useState<string | null>(null)

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  useEffect(() => {
    const hostId = user?.userId
    if (hostId) {
      registerCallback(`/games/${hostId}`, 'ANSWER_CONFIRMED', () => {
        setToastMessage('투표 결과 전송 완료!')
      })
    }
  }, [registerCallback, user?.userId])

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const handleStartVoiceDiscussion = async () => {
    if (roomId && user?.userId) {
      await joinVoiceRoom(roomId, user.userId)
      setIsVoiceRoomJoined(true)
    }
  }

  return (
    <div className="p-6 flex flex-col items-center">
      {/* 토스트 메시지 표시 */}
      {toastMessage && (
        <div className="fixed top-6 left-6 bg-primary-500 text-white text-2xl py-4 px-8 rounded-lg shadow-lg z-50 animate-slide-in-out">
          <div className="relative inline-block">
            <p className="absolute text-primary-800 text-3xl font-outline-4">
              {toastMessage}
            </p>
            <p className="relative text-white text-3xl"> {toastMessage}</p>
          </div>
        </div>
      )}

      <div className="flex items-center w-full mb-4">
        <h2 className="mx-auto w-2/5 h-20 bg-wood bg-cover bg-left flex items-center justify-center text-5xl text-white rounded-xl shadow-lg">
          작은 불 끄기
        </h2>
        <NextStepButton />
      </div>

      <div className="flex self-start">
        <div className="-ml-6 mr-auto bg-wood bg-cover w-72 py-3 pr-5 text-right text-4xl text-white rounded-r-lg shadow-lg">
          발언 대기 목록
        </div>
        {/* 마이크 상태에 따라 버튼을 다르게 표시 */}
        {isVoiceRoomJoined && (
          <button
            onClick={toggleMicrophone}
            className={`ml-4 rounded-xl px-4 border-2 text-2xl ${
              isMuted
                ? 'bg-gray-medium border-gray-dark text-red-600'
                : 'bg-primary-300 border-primary-500 text-lime-600'
            }`}
          >
            {isMuted ? '방장 마이크 꺼짐 🔈❌' : '방장 마이크 켜짐 🔊'}
          </button>
        )}
      </div>

      <div className="flex w-full">
        {!isVoiceRoomJoined && (
          <button
            onClick={handleStartVoiceDiscussion}
            className="bg-secondary-300 border-2 border-secondary-500 w-full py-10 rounded-xl mt-4 hover:bg-secondary-500"
          >
            <p className="text-4xl">음성 토론 시작하기📣</p>
            <p className="text-2xl text-secondary-950 mt-1">
              이 버튼을 누르면 발언 대기 중인 목록이 보여요
            </p>
          </button>
        )}
        <div className={`w-full ${!isVoiceRoomJoined && 'hidden'}`}>
          <WaitingQueue />
        </div>
      </div>

      <div className="-ml-6 mr-auto mt-6 bg-wood bg-cover w-72 py-3 pr-5 text-right text-4xl text-white rounded-r-lg shadow-lg mb-4">
        전체 답변
      </div>
      <AllAnswers />

      <VotingSidebar role="host" />
    </div>
  )
}

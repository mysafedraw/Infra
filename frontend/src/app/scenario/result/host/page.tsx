'use client'

import VotingSidebar from '@/app/scenario/result/components/VotingSidebar'
import AllAnswers from '@/app/scenario/result/components/AllAnswers'
import WaitingQueue from '@/app/scenario/result/host/components/WaitingQueue'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useEffect, useState } from 'react'
import NextStepButton from '@/app/scenario/result/host/components/NextStepButton'
import { useUser } from '@/app/_contexts/UserContext'

export default function ScenarioResultHost() {
  const [toastMessage, setToastMessage] = useState<string>('')
  const { registerCallback } = useWebSocketContext()
  const { user } = useUser()

  useEffect(() => {
    // ANSWER_CONFIRMED 응답을 받을 때 토스트 메시지 표시
    const hostId = user?.userId
    if (hostId) {
      registerCallback(`/games/${hostId}`, 'ANSWER_CONFIRMED', () => {
        setToastMessage('확인된 투표 결과 전송 완료!')
      })
    }
  }, [registerCallback, user?.userId])

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000) // 3초 후 메시지 자동 제거
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

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

      <div className="-ml-6 mr-auto bg-wood bg-cover w-72 py-3 pr-5 text-right text-4xl text-white rounded-r-lg shadow-lg">
        발언 대기 목록
      </div>
      <WaitingQueue />

      <div className="-ml-6 mr-auto mt-6 bg-wood bg-cover w-72 py-3 pr-5 text-right text-4xl text-white rounded-r-lg shadow-lg mb-4">
        전체 답변
      </div>
      <AllAnswers />

      <VotingSidebar role="host" />
    </div>
  )
}

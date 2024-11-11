'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import VoteAction from '@/app/scenario/result/participant/components/VoteAction'
import VotingStatus from '@/app/scenario/result/host/components/VotingStatus'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import VoteConfirm from '@/app/scenario/result/host/components/VoteConfirm'

export default function VotingSidebar({ role }: { role: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)

  const { sendMessage } = useWebSocketContext()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
    setUserId('user1') // 발언중인 애 userId로 바꿔야 함
  }, [])

  const handleEndVote = () => {
    const message = JSON.stringify({ roomId, userId })
    sendMessage('/games/vote/end', message)
    setIsConfirmVisible(true)
    setIsOpen(false)
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* 투명 배경 (사이드바가 열렸을 때만) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]" onClick={toggleSidebar}></div>
      )}

      {/* 사이드바 */}
      <div
        className={`z-[200] fixed top-28 right-0 bg-secondary-100 border-2 border-r-0 border-secondary-500 shadow-lg rounded-l-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-[92%]'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          {/* 토글 버튼 */}
          <button className="p-5" onClick={toggleSidebar}>
            {isOpen ? (
              <Image
                src="/icons/right-arrow.svg"
                alt="close"
                width={17}
                height={76}
              />
            ) : (
              <Image
                src="/icons/left-arrow.svg"
                alt="open"
                width={17}
                height={76}
              />
            )}
          </button>

          {/* 사이드바 내용 */}
          <div className="p-6 pl-2">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl">현재 진행 중인 투표</h2>
              {role === 'host' && (
                <button
                  onClick={handleEndVote}
                  className="bg-amber-200 border border-amber-500 text-3xl py-2 px-8 rounded-lg hover:bg-amber-300"
                >
                  종료하기
                </button>
              )}
            </div>

            {role === 'host' ? <VotingStatus /> : <VoteAction />}
          </div>
        </div>
      </div>

      {isConfirmVisible && (
        <VoteConfirm onClose={() => setIsConfirmVisible(false)} />
      )}
    </>
  )
}

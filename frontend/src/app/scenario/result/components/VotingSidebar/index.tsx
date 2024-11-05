'use client'

import { useState } from 'react'
import Image from 'next/image'
import VoteAction from '@/app/scenario/result/participant/components/VoteAction'
import VotingStatus from '@/app/scenario/result/host/components/VotingStatus'

export default function VotingSidebar({ role }: { role: string }) {
  const [isOpen, setIsOpen] = useState(false)

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
            <h2 className="text-4xl mb-4">현재 진행 중인 투표</h2>

            {role === 'host' ? <VotingStatus /> : <VoteAction />}
          </div>
        </div>
      </div>
    </>
  )
}

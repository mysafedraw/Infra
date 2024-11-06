'use client'

import { useState } from 'react'
import Image from 'next/image'
import ChatBox from '@/app/_components/ChatBox'

export default function ChatButton() {
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false)

  // 버튼 클릭 시 ChatBox 표시 상태 토글
  const toggleChatBox = () => {
    setIsChatBoxOpen((prev) => !prev)
  }

  return (
    <div className="relative">
      {/* 채팅 버튼 */}
      <button
        onClick={toggleChatBox}
        className="z-50 fixed bottom-10 right-10 flex flex-col gap-1 items-center justify-center size-40 bg-primary-500 rounded-full text-white shadow-lg"
      >
        <Image src="/icons/message.svg" alt="chat" width={63} height={62} />
        <div className="relative inline-block">
          <p className="absolute text-primary-800 text-3xl font-outline-4">
            채팅
          </p>
          <p className="relative text-white text-3xl">채팅</p>
        </div>
      </button>

      {/* ChatBox 컴포넌트 */}
      {isChatBoxOpen && (
        <div className="z-40 fixed bottom-40 right-20 w-[500px] h-3/4 mb-8">
          <ChatBox />
        </div>
      )}
    </div>
  )
}

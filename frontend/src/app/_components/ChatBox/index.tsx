import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useChat } from '@/app/_contexts/ChatContext'

export default function ChatBox() {
  const { messages, sendMessage } = useChat()
  const [inputText, setInputText] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim()) {
      sendMessage(inputText)
      setInputText('')
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="relative h-full w-full bg-white rounded-lg shadow-md pb-[85px]">
      <div
        className="overflow-auto space-y-4 h-full p-4 pb-0"
        ref={chatContainerRef} // 스크롤을 위한 ref
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1.5 ${message.isSender ? 'items-end' : 'items-start'}`}
          >
            {!message.isSender && (
              <div className="flex items-center gap-2">
                <Image
                  src="/images/tiger.png"
                  alt="user1"
                  width={32}
                  height={32}
                  className="size-8 shrink-0 bg-secondary-400 rounded-full object-cover object-top pt-1"
                />
                <p className="text-2xl">{message.user}</p>
              </div>
            )}
            <div
              className={`flex ${message.isSender ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`${message.isSender ? 'bg-primary-500' : 'bg-secondary-500'} px-4 py-3 rounded-xl max-w-xs text-2xl`}
              >
                {message.text}
              </div>
              <p className="text-gray-dark text-lg self-end mx-1.5">
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <form
        className="absolute bottom-0 inset-x-0 m-4 flex items-center"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-grow bg-gray-medium rounded-lg px-4 py-3 mr-3 text-2xl hover:outline-primary-500 focus:outline-primary-500 focus:bg-gray-light"
        />
        <button type="submit" className="bg-primary-500 p-3 rounded-lg">
          <Image
            src="/icons/direct-right.svg"
            alt="send"
            width={30}
            height={30}
          />
        </button>
      </form>
    </div>
  )
}

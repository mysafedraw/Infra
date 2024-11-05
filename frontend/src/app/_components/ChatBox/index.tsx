import React from 'react'
import Image from 'next/image'

interface ChatMessage {
  id: number
  user: string
  text: string
  time: string
  isSender: boolean
}

const messages: ChatMessage[] = [
  {
    id: 1,
    user: '2학년 1반 김유경',
    text: '햄버거 먹고 싶다',
    time: '04:55 오후',
    isSender: false,
  },
  {
    id: 2,
    user: '2학년 1반 김유경',
    text: '나 김유경 다이어트는 역시 어렵다 나 김유경 다이어트는 역시 어렵다 나 김유경 다이어트는 역시 어렵다 나 김유경 다이어트는 역시 어렵다 나 김유경 다이어트는 역시 어렵다',
    time: '04:56 오후',
    isSender: false,
  },
  {
    id: 3,
    user: '',
    text: '햄벅유경은 햄벅해',
    time: '04:58 오후',
    isSender: true,
  },
]

export default function ChatBox() {
  return (
    <div className="relative h-full w-full p-4 bg-white rounded-lg shadow-md">
      <div className="overflow-auto space-y-4">
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
                className={`${
                  message.isSender ? 'bg-primary-500' : 'bg-secondary-500'
                } px-4 py-3 rounded-xl max-w-xs text-2xl`}
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
      <div className="absolute bottom-0 inset-x-0 m-4 flex items-center">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          className="flex-grow bg-gray-medium rounded-lg px-4 py-3 mr-3 text-2xl hover:outline-primary-500 focus:outline-primary-500 focus:bg-gray-light"
        />
        <button className="bg-primary-500 p-3 rounded-lg">
          <Image
            src="/icons/direct-right.svg"
            alt="send"
            width={30}
            height={30}
          />
        </button>
      </div>
    </div>
  )
}

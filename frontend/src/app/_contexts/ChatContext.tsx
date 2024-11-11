'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'

interface ChatMessage {
  id: number
  user: string
  text: string
  time: string
  isSender: boolean
}

interface ChatContextType {
  messages: ChatMessage[]
  addMessage: (message: ChatMessage) => void
  sendMessage: (content: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: '2학년 1반 김유경',
      text: '햄버거 먹고 싶다',
      time: '04:55 오후',
      isSender: false,
    },
  ])

  // 임시 데이터
  const [userId] = useState(() => Math.random().toString(36).substring(2, 12))
  const roomNumber = '859338'
  const nickname = '유경'

  const { sendMessage: sendWebSocketMessage, registerCallback } =
    useWebSocketContext()

  const addMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  const handleReceivedMessage = useCallback(
    (parsedMessage: {
      senderId: string
      nickname: string
      content: string
      sentAt: string
    }) => {
      if (parsedMessage.senderId === userId) return

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          user: parsedMessage.nickname,
          text: parsedMessage.content,
          time: parsedMessage.sentAt,
          isSender: parsedMessage.senderId === userId,
        },
      ])
    },
    [userId],
  )

  useEffect(() => {
    // 콜백을 /chat/${roomNumber} 채널에 대해 등록
    registerCallback(
      `/chat/${roomNumber}`,
      'CHAT_MESSAGE',
      handleReceivedMessage,
    )
  }, [registerCallback, roomNumber, handleReceivedMessage])

  const handleSendMessage = (content: string) => {
    const newMessage = {
      senderId: userId,
      roomId: roomNumber,
      content,
      nickname,
      sentAt: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    sendWebSocketMessage(`/chat/send`, JSON.stringify(newMessage))
    addMessage({
      id: messages.length + 1,
      user: nickname,
      text: content,
      time: newMessage.sentAt,
      isSender: true,
    })
  }

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, sendMessage: handleSendMessage }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

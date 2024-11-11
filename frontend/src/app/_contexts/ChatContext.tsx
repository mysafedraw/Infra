'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react'
import { useWebSocketContext } from '@/app/_contexts/WebSocketContext'
import { useUser } from '@/app/_contexts/UserContext'

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
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [roomId, setRoomId] = useState<string | null>(null)
  const { user } = useUser()

  const { sendMessage: sendWebSocketMessage, registerCallback } =
    useWebSocketContext()

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

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
      if (parsedMessage.senderId === user?.userId) return

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          user: parsedMessage.nickname,
          text: parsedMessage.content,
          time: parsedMessage.sentAt,
          isSender: parsedMessage.senderId === user?.userId,
        },
      ])
    },
    [user?.userId],
  )

  useEffect(() => {
    registerCallback(`/chat/${roomId}`, 'CHAT_MESSAGE', handleReceivedMessage)
  }, [registerCallback, roomId, handleReceivedMessage])

  const handleSendMessage = (content: string) => {
    const newMessage = {
      senderId: user?.userId,
      roomId,
      content,
      nickname: user?.nickname,
      sentAt: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    sendWebSocketMessage(`/chat/send`, JSON.stringify(newMessage))
    addMessage({
      id: messages.length + 1,
      user: user?.nickname || '',
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

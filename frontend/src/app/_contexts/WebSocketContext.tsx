'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Client, Frame, Message } from '@stomp/stompjs'

interface WebSocketContextProps {
  client: Client | null
  isConnected: boolean
  sendMessage: (destination: string, body: string) => void
  registerCallback: (
    destination: string,
    action: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (message: any) => void,
  ) => void
  initializeWebSocket: () => Promise<void> // 초기화 함수 추가
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined,
)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const clientRef = useRef<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // 콜백 함수를 저장할 객체
  const callbackRegistry = useRef<{
    [destination: string]: { [action: string]: (message: Message) => void }
  }>({})

  const handleMessage = (message: Message) => {
    const parsedMessage = JSON.parse(message.body)
    const destination = message.headers.destination
    const action = parsedMessage.action

    // 등록된 콜백 실행
    if (
      destination &&
      action &&
      callbackRegistry.current[destination]?.[action]
    ) {
      callbackRegistry.current[destination][action](parsedMessage)
    } else {
      console.warn(
        `등록된 콜백이 없습니다: destination=${destination}, action=${action}`,
      )
    }
  }

  // 초기화
  const initializeWebSocket = async () => {
    // 기존 연결이 있다면 해제
    if (clientRef.current) {
      await clientRef.current.deactivate()
    }

    const roomId = localStorage.getItem('roomId')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user?.userId

    return new Promise<void>((resolve, reject) => {
      const wsClient = new Client({
        brokerURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/ws-stomp`,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => console.log('STOMP: ', str),
      })

      wsClient.onConnect = (frame: Frame) => {
        console.log('WebSocket 연결 성공:', frame)
        setIsConnected(true)

        if (roomId && userId) {
          console.log(`구독 설정 중: roomId=${roomId}, userId=${userId}`)

          wsClient.subscribe(`/games/${roomId}`, handleMessage)
          wsClient.subscribe(`/chat/${roomId}`, handleMessage)
          wsClient.subscribe(`/games/${userId}`, handleMessage)
          wsClient.subscribe(`/rooms/${roomId}`, handleMessage)
        } else {
          console.warn('roomId 또는 userId가 localStorage에 없습니다.')
        }

        clientRef.current = wsClient
        resolve()
      }

      wsClient.onStompError = (frame) => {
        console.error('STOMP Error:', frame.headers.message)
        reject(new Error('STOMP connection error'))
      }

      wsClient.onDisconnect = () => {
        console.log('WebSocket 연결 해제')
        setIsConnected(false)
      }

      wsClient.activate()
    })
  }

  useEffect(() => {
    initializeWebSocket().catch((error) =>
      console.error('WebSocket initialization failed:', error),
    )

    return () => {
      if (clientRef.current) {
        clientRef.current
          .deactivate()
          .then(() => console.log('WebSocket 연결 해제 완료'))
      }
    }
  }, [])

  const sendMessage = (destination: string, body: string) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({ destination, body })
    } else {
      console.warn('STOMP client is not connected')
    }
  }

  const registerCallback = (
    destination: string,
    action: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (message: any) => void,
  ) => {
    if (!callbackRegistry.current[destination]) {
      callbackRegistry.current[destination] = {}
    }
    callbackRegistry.current[destination][action] = callback
  }

  return (
    <WebSocketContext.Provider
      value={{
        client: clientRef.current,
        isConnected,
        sendMessage,
        registerCallback,
        initializeWebSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error(
      'useWebSocketContext must be used within a WebSocketProvider',
    )
  }
  return context
}

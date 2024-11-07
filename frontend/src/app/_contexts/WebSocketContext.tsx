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
    callback: (message: any) => void,
  ) => void
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

  useEffect(() => {
    const initializeClient = async () => {
      return new Promise<Client>((resolve, reject) => {
        const wsClient = new Client({
          brokerURL: 'http://70.12.247.148:8080/ws-stomp',
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          debug: (str) => console.log('STOMP: ', str),
        })

        wsClient.onConnect = (frame: Frame) => {
          console.log('WebSocket 연결 성공:', frame)
          setIsConnected(true)

          const roomNumber = localStorage.getItem('roomNumber')
          const userId = localStorage.getItem('userId')

          if (roomNumber && userId) {
            // 단일 구독 설정
            wsClient.subscribe(`/games/${roomNumber}`, handleMessage)
            wsClient.subscribe(`/chat/${roomNumber}`, handleMessage)
            wsClient.subscribe(`/games/${userId}`, handleMessage)
            wsClient.subscribe(`/rooms/${roomNumber}`, handleMessage)
          } else {
            console.warn('roomNumber 또는 userId가 localStorage에 없습니다.')
          }

          resolve(wsClient)
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

    initializeClient()
      .then((wsClient) => {
        clientRef.current = wsClient
      })
      .catch((error) =>
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
    callback: (message: unknown) => void,
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

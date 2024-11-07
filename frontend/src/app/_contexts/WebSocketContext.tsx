'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Client, Frame } from '@stomp/stompjs'

interface WebSocketContextProps {
  client: Client | null
  isConnected: boolean
  sendMessage: (destination: string, body: string) => void
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined,
)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)

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
          resolve(wsClient)
        }

        wsClient.onStompError = (frame) => {
          console.error('STOMP Error:', frame.headers.message)
          console.log('Additional details: ' + frame.body)
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
      .then((wsClient) => setClient(wsClient))
      .catch((error) =>
        console.error('WebSocket initialization failed:', error),
      )

    return () => {
      if (client) {
        client.deactivate().then(() => console.log('WebSocket 연결 해제 완료'))
      }
    }
  }, [])

  const sendMessage = async (destination: string, body: string) => {
    if (client && client.connected) {
      client.publish({ destination, body })
    } else {
      console.warn('STOMP client is not connected')
    }
  }

  return (
    <WebSocketContext.Provider value={{ client, isConnected, sendMessage }}>
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

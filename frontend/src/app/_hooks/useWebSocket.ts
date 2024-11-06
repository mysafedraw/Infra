import { useEffect, useCallback } from 'react'
import {
  initializeWebSocketClient,
  publishMessage,
} from '@/app/_utils/websocketClient'

type MessageHandler = (message: string) => void

export default function useWebSocket(
  roomNumber: string,
  userId: string,
  targetChannel: string,
  onMessageReceived: MessageHandler,
) {
  useEffect(() => {
    initializeWebSocketClient(roomNumber, userId, (channel, message) => {
      if (channel === targetChannel) {
        onMessageReceived(message)
      }
    })
  }, [roomNumber, userId, targetChannel, onMessageReceived])

  const sendMessage = useCallback(
    (message: string) => {
      publishMessage(targetChannel, message)
    },
    [targetChannel],
  )

  return { sendMessage }
}

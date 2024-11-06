import { Client, Frame, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient: Client | null = null

export function initializeWebSocketClient(
  roomNumber: string,
  userId: string,
  onMessageReceived: (channel: string, message: string) => void,
) {
  if (!stompClient) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS('http://70.12.247.148:8080/ws-stomp'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('STOMP: ', str),
    })

    stompClient.onConnect = (frame: Frame) => {
      console.log('Connected:', frame)

      const channels = [
        `/topic/messages`,
        `/chat/${roomNumber}`,
        `/games/${roomNumber}`,
        `/games/${userId}`,
        `/rooms/${roomNumber}`,
      ]

      channels.forEach((channel) => {
        stompClient?.subscribe(channel, (message: IMessage) => {
          onMessageReceived(channel, message.body)
        })
      })
    }

    stompClient.onStompError = (frame) => {
      console.error('STOMP Error:', frame)
    }

    stompClient.activate()
  } else if (!stompClient.active) {
    stompClient.activate()
  }

  return stompClient
}

// 메시지 전송 함수
export function publishMessage(destination: string, body: string) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination, body })
  } else {
    console.warn('STOMP client is not connected')
  }
}

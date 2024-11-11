import { ReactNode } from 'react'
import { ChatProvider } from '@/app/_contexts/ChatContext'
import { WebSocketProvider } from '@/app/_contexts/WebSocketContext'

export default function ScenarioLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <WebSocketProvider>
      <ChatProvider>
        {modal}
        <main>{children}</main>
      </ChatProvider>
    </WebSocketProvider>
  )
}

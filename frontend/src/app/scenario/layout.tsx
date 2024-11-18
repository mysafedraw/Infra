import { ReactNode } from 'react'
import { ChatProvider } from '@/app/_contexts/ChatContext'
import { WebSocketProvider } from '@/app/_contexts/WebSocketContext'
import { SpeakingRightProvider } from '@/app/_contexts/SpeakingRight'
import { OpenViduProvider } from '@/app/_contexts/OpenViduContext'

export default function ScenarioLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <SpeakingRightProvider>
      <OpenViduProvider>
        <WebSocketProvider>
          <ChatProvider>
            {modal}
            <main>{children}</main>
          </ChatProvider>
        </WebSocketProvider>
      </OpenViduProvider>
    </SpeakingRightProvider>
  )
}

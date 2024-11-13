import { ReactNode } from 'react'
import { ChatProvider } from '@/app/_contexts/ChatContext'
import { WebSocketProvider } from '@/app/_contexts/WebSocketContext'
import { LiveKitProvider } from '@/app/_contexts/LiveKitContext'
import { SpeakingRightProvider } from '@/app/_contexts/SpeakingRight'

export default function ScenarioLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <SpeakingRightProvider>
      <LiveKitProvider>
        <WebSocketProvider>
          <ChatProvider>
            {modal}
            <main>{children}</main>
          </ChatProvider>
        </WebSocketProvider>
      </LiveKitProvider>
    </SpeakingRightProvider>
  )
}

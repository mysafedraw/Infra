import { ReactNode } from 'react'
import { ChatProvider } from '@/app/_contexts/ChatContext'

export default function ScenarioLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <ChatProvider>
      {modal}
      <main>{children}</main>
    </ChatProvider>
  )
}

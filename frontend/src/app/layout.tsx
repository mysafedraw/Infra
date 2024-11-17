import type { Metadata } from 'next'
import './globals.css'
import { UserProvider } from '@/app/_contexts/UserContext'

export const metadata: Metadata = {
  title: '내가 그린 안전 그림',
  description: 'My Safe Draw',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body>{children}</body>
      </UserProvider>
    </html>
  )
}

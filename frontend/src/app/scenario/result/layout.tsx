import ChatButton from '@/app/scenario/result/components/ChatButton'

export default function ScenarioResultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-[url('/images/classroom.png')] bg-cover bg-center min-h-screen">
      {children}
      <ChatButton />
    </div>
  )
}

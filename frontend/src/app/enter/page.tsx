'use client'

import { useRouter } from 'next/navigation'
import SignButton from '../_components/SignButton'
import EnterInput from './components/EnterInput'

export default function Enter() {
  const router = useRouter()
  const roomCode = 1

  const handleMove = () => {
    router.push(`/lobby/${roomCode}`)
  }

  return (
    <div className="p-20 w-screen h-screen bg-secondary-500 flex flex-col">
      <h1 className="text-6xl text-white font-outline-2 text-center">
        QR 코드를 스캔하거나 방 코드를 입력해주세요
      </h1>
      {/* QR 코드 사진 추가하기 */}
      <div className="size-64"></div>
      <div className="flex h-full justify-center flex-col items-center">
        <EnterInput />
      </div>
      <div className="flex justify-end">
        <SignButton content="접속하기" onClick={handleMove} />
      </div>
    </div>
  )
}

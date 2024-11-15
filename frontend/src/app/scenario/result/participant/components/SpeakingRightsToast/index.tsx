'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUser } from '@/app/_contexts/UserContext'
import { useLiveKit } from '@/app/_contexts/LiveKitContext'

export default function SpeakingRightsToast() {
  const [isVisible, setIsVisible] = useState(true)
  const [roomId, setRoomId] = useState<string | null>(null)
  const { user } = useUser()
  const { enableMicForSpeakingRights } = useLiveKit() // 발언권 획득 함수 가져오기

  useEffect(() => {
    setRoomId(localStorage.getItem('roomId'))
  }, [])

  const handleConfirmClick = async () => {
    if (roomId && user?.userId) {
      await enableMicForSpeakingRights(roomId, user?.userId) // 발언권 획득 및 마이크 활성화
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      {/* 어두운 블러 배경 */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur"></div>

      {/* 토스트 메시지 */}
      <div className="relative bg-secondary-500 border-4 border-secondary-300 text-center rounded-xl py-12 px-28 shadow-button-active">
        <h2 className="text-white drop-shadow text-5xl mb-2">
          발언권을 얻었어요
        </h2>
        <div className="flex justify-center my-6">
          <Image
            src={user?.avatarImg || '/images/tiger.png'}
            alt="speaking-rights-icon"
            width={435}
            height={574}
            className="w-32 h-auto"
          />
        </div>
        <p className="text-3xl">답변에 대한 설명을 진행해보세요</p>
        <button
          onClick={handleConfirmClick}
          className="mt-8 bg-white text-3xl py-2 w-1/2 rounded-md text-secondary-800 hover:text-secondary-950"
        >
          확인
        </button>
      </div>
    </div>
  )
}

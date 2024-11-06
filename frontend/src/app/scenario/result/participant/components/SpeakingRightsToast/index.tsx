'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function SpeakingRightsToast() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // 3초 후에 메시지가 사라지도록 설정
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    // 컴포넌트가 언마운트될 때 타이머를 정리
    return () => clearTimeout(timer)
  }, [])

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
            src="/images/tiger.png"
            alt="speaking-rights-icon"
            width={435}
            height={574}
            className="w-32 h-auto"
          />
        </div>
        <p className="text-3xl">답변에 대한 설명을 진행해보세요</p>
      </div>
    </div>
  )
}

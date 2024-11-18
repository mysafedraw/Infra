'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CommonToastProps {
  message: string
  duration?: number
  imageSrc?: string
  altText?: string
  isBackGround?: boolean
  handleDurationEnd?: () => void
}

export default function CommonToast({
  message,
  duration = 3000,
  imageSrc,
  altText = 'toast-icon',
  handleDurationEnd,
  isBackGround = true,
}: CommonToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)

      if (handleDurationEnd) {
        handleDurationEnd()
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, handleDurationEnd])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      {/* 어두운 블러 배경 */}
      {isBackGround && (
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur"></div>
      )}
      {/* 토스트 메시지 */}
      <div className="relative bg-secondary-500 border-4 border-secondary-300 text-center rounded-xl py-12 px-28 shadow-button-active">
        {imageSrc && (
          <div className="flex justify-center my-6">
            <Image
              src={imageSrc}
              alt={altText}
              width={435}
              height={574}
              className="w-32 h-auto"
            />
          </div>
        )}
        <p className="text-3xl text-text whitespace-pre-line">{message}</p>
      </div>
    </div>
  )
}

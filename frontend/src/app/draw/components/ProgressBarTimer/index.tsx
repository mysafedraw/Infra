'use client'

import { useEffect, useState } from 'react'

export default function ProgressBarTimer({
  initialTime,
  handleTimeEnd,
}: {
  initialTime: number
  handleTimeEnd?: () => void
}) {
  const [progress, setProgress] = useState(100)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + initialTime * 1000

    const updateProgress = () => {
      const now = Date.now()
      const remaining = Math.max(0, endTime - now)
      const newProgress = (remaining / (initialTime * 1000)) * 100

      setProgress(newProgress)

      // 10초 남아있을 때 경고 상태로
      setIsWarning(remaining <= 10000)

      if (newProgress <= 0) {
        handleTimeEnd?.()
        return false
      }
      return true
    }

    // 초기 진행률 설정
    updateProgress()

    const intervalId = setInterval(() => {
      const shouldContinue = updateProgress()
      if (!shouldContinue) {
        clearInterval(intervalId)
      }
    }, 16)

    return () => clearInterval(intervalId)
  }, [initialTime, handleTimeEnd])

  return (
    <div className={`absolute top-0 w-full h-4 bg-gray-200 overflow-hidden`}>
      <div
        className={`h-full transition-all duration-16 rounded-r-full ${
          isWarning ? 'bg-red-500' : 'bg-primary-600'
        }`}
        style={{
          width: `${progress}%`,
          transition: 'width 16ms linear',
        }}
      />
    </div>
  )
}

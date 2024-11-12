import { useCallback, useEffect, useMemo, useState } from 'react'
import AlarmClockIcon from '/public/icons/alarm-clock.svg'

const calculateProgress = (
  endTime: number | null,
  initialTime: number,
): number => {
  if (!endTime) return 100
  const remaining = Math.max(0, endTime - Date.now())
  return (remaining / (initialTime * 1000)) * 100
}

export default function DrawTimer({
  initialTime,
  handleTimeEnd,
}: {
  initialTime: number
  handleTimeEnd?: () => void
}) {
  const endTime = useMemo(() => {
    return Number(localStorage.getItem('endTime')) || null
  }, [])

  const getInitialProgress = useCallback(() => {
    return calculateProgress(endTime, initialTime)
  }, [endTime, initialTime])

  const [progress, setProgress] = useState(getInitialProgress)
  const [time, setTime] = useState(initialTime)
  const [isWarning, setIsWarning] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isTimeEnded, setIsTimeEnded] = useState(false)

  const updateProgress = useCallback(() => {
    if (!endTime) return false

    const remaining = Math.max(0, endTime - Date.now())
    const newProgress = (remaining / (initialTime * 1000)) * 100
    const newTime = Math.ceil(remaining / 1000)

    setProgress(newProgress)
    setTime(newTime)
    setIsWarning(remaining <= 10000)

    if (newProgress <= 0) {
      setIsTimeEnded(true)
      localStorage.removeItem('endTime')
      handleTimeEnd?.()
      return false
    }
    return true
  }, [endTime, initialTime, handleTimeEnd])

  useEffect(() => {
    if (isTimeEnded) return

    // 초기 상태 설정
    updateProgress()

    // Progress bar 업데이트 (60fps)
    const progressInterval = setInterval(() => {
      const shouldContinue = updateProgress()
      if (!shouldContinue) {
        clearInterval(progressInterval)
      }
    }, 16)

    return () => {
      clearInterval(progressInterval)
      if (isTimeEnded) {
        localStorage.removeItem('endTime')
      }
    }
  }, [updateProgress, isTimeEnded])

  // 깜빡임 효과를 위한 별도의 useEffect
  useEffect(() => {
    let blinkInterval: NodeJS.Timeout

    if (isWarning && !isTimeEnded) {
      blinkInterval = setInterval(() => {
        setIsBlinking((prev) => !prev)
      }, 500)
    } else {
      setIsBlinking(false)
    }

    return () => {
      if (blinkInterval) {
        clearInterval(blinkInterval)
      }
    }
  }, [isWarning, isTimeEnded])

  return (
    <>
      {/* 막대 타이머 */}
      <div className="absolute top-0 w-full h-4 bg-gray-200 overflow-hidden">
        <div
          className={`h-full transition-all duration-16 rounded-r-full ${
            isWarning ? 'bg-red-500' : 'bg-primary-600'
          }`}
          style={{
            width: `${progress}%`,
            transition: isTimeEnded ? 'none' : 'width 16ms linear',
          }}
        />
      </div>

      {/* 숫자 타이머 */}
      <div
        className={`absolute left-4 top-8 rounded-md px-4 py-2 min-w-36 flex justify-center items-center gap-2 border-4 bg-gray-light select-none ${
          isWarning && isBlinking
            ? 'border-red-500 text-red-500'
            : 'border-primary-600'
        }`}
      >
        <AlarmClockIcon />
        <span
          className={`text-3xl font-bold tracking-wide min-w-[80px] ${
            isWarning ? 'text-inherit' : 'text-text'
          }`}
        >
          {String(Math.floor(time / 60)).padStart(2, '0')} :{' '}
          {String(time % 60).padStart(2, '0')}
        </span>
      </div>
    </>
  )
}

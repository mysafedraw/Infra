'use client'

import { useEffect, useState } from 'react'
import AlarmClockIcon from '/public/icons/alarm-clock.svg'

export default function DrawTimer({
  initialTime,
  handleTimeEnd,
}: {
  initialTime: number
  handleTimeEnd?: () => void
}) {
  const [time, setTime] = useState(initialTime)
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    // 타이머 로직
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleTimeEnd?.()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [handleTimeEnd])

  // 깜빡임 효과
  useEffect(() => {
    let blinkInterval: NodeJS.Timeout

    if (time <= 10) {
      blinkInterval = setInterval(() => {
        setIsBlinking((prev) => !prev)
      }, 300) // 0.3초마다 깜빡
    } else {
      setIsBlinking(false)
    }

    return () => {
      if (blinkInterval) {
        clearInterval(blinkInterval)
      }
    }
  }, [time])

  return (
    <div
      className={`absolute left-4 top-8 rounded-md px-4 py-2 min-w-36 flex justify-center items-center gap-2 border-4 bg-gray-light select-none ${
        time <= 10 && isBlinking
          ? 'border-red-500 text-red-500'
          : 'border-primary-600 '
      }`}
    >
      <AlarmClockIcon />
      <span
        className={`text-3xl font-bold tracking-wide min-w-[80px] ${
          time <= 10 ? 'text-inherit' : 'text-text'
        }`}
      >
        {String(Math.floor(time / 60)).padStart(2, '0')} :{' '}
        {String(time % 60).padStart(2, '0')}
      </span>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

export default function MicTest() {
  const [micTestValue, setMicTestValue] = useState<number>(0)
  const [numBars, setNumBars] = useState<number>(50)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateNumBars = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const barWidth = 4
        const gap = 4
        setNumBars(Math.floor(containerWidth / (barWidth + gap)))
      }
    }

    updateNumBars()
    window.addEventListener('resize', updateNumBars)
    return () => window.removeEventListener('resize', updateNumBars)
  }, [])

  const startMicTest = () => {
    setMicTestValue(Math.floor(Math.random() * 100))
  }

  return (
    <div>
      <label className="mr-4 text-3xl">마이크 테스트</label>
      <p className="text-gray-dark text-xl">
        테스트를 시작하고 아무 말이나 해보세요. 3초간 녹음 후 다시 들려
        드릴게요.
      </p>
      <div className="grid grid-cols-[96px_auto] gap-4 items-center mt-3">
        <button
          onClick={startMicTest}
          className="py-2 bg-white border border-gray-dark rounded-lg text-xl"
        >
          테스트
        </button>
        <div
          ref={containerRef}
          className="flex gap-1 overflow-hidden h-10 w-full"
        >
          {Array.from({ length: numBars }).map((_, index) => (
            <div
              key={index}
              className={`h-full w-1 rounded ${
                index < (micTestValue / 100) * numBars
                  ? 'bg-primary-500'
                  : 'bg-gray-dark'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

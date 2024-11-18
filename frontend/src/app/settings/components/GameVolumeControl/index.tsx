'use client'

import { useState } from 'react'

export default function GameVolumeControl() {
  const [gameVolume, setGameVolume] = useState<number>(3) // 기본값: 중간값

  const handleGameVolumeChange = (level: number) => setGameVolume(level)

  return (
    <div className="grid grid-cols-[1fr_3fr] items-center">
      <label className="text-4xl">게임 볼륨</label>
      <div className="relative flex justify-between items-center">
        <div className="absolute w-full h-1.5 bg-gray-dark rounded-full" />
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="flex flex-col items-center">
            <button
              onClick={() => handleGameVolumeChange(level)}
              className={`relative rounded-full ${
                gameVolume === level
                  ? 'bg-primary-500 size-10'
                  : 'bg-gray-dark size-7'
              } flex items-center justify-center `}
            >
              <div
                className={`relative rounded-full ${
                  gameVolume === level
                    ? 'bg-primary-50 size-5'
                    : 'bg-white size-3'
                } flex items-center justify-center`}
              />
            </button>
            <p className="absolute -bottom-6 text-gray-dark">
              {level === 1 ? 'OFF' : level === 5 ? 'MAX' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

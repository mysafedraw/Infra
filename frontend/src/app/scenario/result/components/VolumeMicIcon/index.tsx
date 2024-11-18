'use client'

import MicIcon from '/public/icons/microphone.svg'
import { useState, useEffect } from 'react'

export default function VolumeMicIcon() {
  const [volume, setVolume] = useState(0)

  useEffect(() => {
    // 랜덤하게 volume 상태 변경
    const interval = setInterval(() => {
      setVolume(Math.floor(Math.random() * 101)) // 0 ~ 100 사이의 값
    }, 500)

    return () => clearInterval(interval) // 컴포넌트 언마운트 시 interval 해제
  }, [])

  return (
    <div className="relative">
      {/* 회색 마이크 아이콘 */}
      <MicIcon className="w-11 h-11 fill-gray-dark stroke-gray-dark" />

      {/* 컬러 마이크 아이콘 */}
      <div
        className="absolute w-full overflow-hidden"
        style={{ height: `${volume}%`, bottom: 0 }}
      >
        <MicIcon className="w-11 h-11 fill-primary-500 stroke-primary-500 absolute bottom-0" />
      </div>
    </div>
  )
}

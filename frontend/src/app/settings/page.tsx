'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export default function Settings() {
  const [nickname, setNickname] = useState<string>('햄벅유경')
  const [gameVolume, setGameVolume] = useState<number>(3) // 5단계 중 기본값은 중간값
  const [speakerVolume, setSpeakerVolume] = useState<number>(50)
  const [micVolume, setMicVolume] = useState<number>(50)
  const [micTestValue, setMicTestValue] = useState<number>(0)
  const [numBars, setNumBars] = useState<number>(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNickname(e.target.value)
  const handleSpeakerVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSpeakerVolume(Number(e.target.value))
  const handleMicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMicVolume(Number(e.target.value))
  const handleGameVolumeChange = (level: number) => setGameVolume(level)

  useEffect(() => {
    const updateNumBars = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const barWidth = 4 // 각 막대의 너비
        const gap = 4 // 각 막대 사이의 간격
        setNumBars(Math.floor(containerWidth / (barWidth + gap)))
      }
    }

    // 초기 설정 및 리사이즈 이벤트에 따른 막대 개수 조절
    updateNumBars()
    window.addEventListener('resize', updateNumBars)
    return () => window.removeEventListener('resize', updateNumBars)
  }, [])

  const startMicTest = () => {
    // 마이크 테스트 기능 구현 가능
    setMicTestValue(Math.floor(Math.random() * 100))
  }

  return (
    <div className="p-20 w-screen h-screen bg-secondary-500">
      <div className="flex items-center drop-shadow-md mb-10">
        <Image src="/icons/back_arrow.svg" alt="Icon" width={32} height={32} />
        <h1 className="ml-6 text-7xl text-white">설정</h1>
      </div>
      <div className="p-16 flex bg-white bg-opacity-80 rounded-xl">
        <div className="flex flex-col items-center">
          <Image
            src="/images/tiger.png"
            alt="tiger"
            width={176}
            height={176}
            className="size-44 bg-primary-400 rounded-full object-cover object-top pt-4"
            priority
          />
          <button className="mt-5 w-full py-3 bg-white border-2 border-primary-500 rounded-xl text-primary-600 text-3xl">
            캐릭터 변경
          </button>
        </div>
        <div className="ml-10 p-6 flex-grow space-y-12">
          <div className="grid grid-cols-[1fr_3fr] items-center">
            <label className="text-4xl">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className="w-full px-6 py-3 bg-gray-white border border-gray-dark hover:outline-primary-500 focus:outline-primary-500 rounded-xl text-2xl"
            />
          </div>

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

          <div className="grid grid-cols-[1fr_3fr]">
            <label className="text-4xl">음성</label>
            <div className="flex flex-col gap-6">
              <div className="flex items-center mb-3">
                <label className="mr-4 text-3xl">스피커</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={speakerVolume}
                  onChange={handleSpeakerVolumeChange}
                  className="grow appearance-none h-3 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
                  style={{
                    background: `linear-gradient(to right, #C2EA7C ${speakerVolume}%, #A9A9A9 ${speakerVolume}%)`,
                  }}
                />
              </div>
              <div className="flex items-center mb-3">
                <label className="mr-4 text-3xl">마이크</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={micVolume}
                  onChange={handleMicVolumeChange}
                  className="grow appearance-none h-3 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
                  style={{
                    background: `linear-gradient(to right, #C2EA7C ${micVolume}%, #A9A9A9 ${micVolume}%)`,
                  }}
                />
              </div>
              <div>
                <label className="mr-4 text-3xl">마이크 테스트</label>
                <p className="text-gray-dark text-xl">
                  테스트를 시작하고 아무 말이나 해보세요. 3초간 녹음 후 다시
                  들려 드릴게요.
                </p>
                <div className="grid grid-cols-[96px_auto] gap-4 items-center mt-3">
                  {/* 테스트 버튼 */}
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
                        className={`h-full w-1 rounded ${index < (micTestValue / 100) * numBars ? 'bg-primary-500' : 'bg-gray-dark'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function VotingSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* 투명 배경 (사이드바가 열렸을 때만) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]" onClick={toggleSidebar}></div>
      )}

      {/* 사이드바 */}
      <div
        className={`z-[200] fixed top-28 right-0 bg-secondary-100 border-2 border-r-0 border-secondary-500 shadow-lg rounded-l-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-[92%]'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          {/* 토글 버튼 */}
          <button className="p-5" onClick={toggleSidebar}>
            {isOpen ? (
              <Image
                src="/icons/right-arrow.svg"
                alt="close"
                width={17}
                height={76}
              />
            ) : (
              <Image
                src="/icons/left-arrow.svg"
                alt="open"
                width={17}
                height={76}
              />
            )}
          </button>

          {/* 사이드바 내용 */}
          <div className="p-6 pl-2">
            <h2 className="text-4xl mb-4">현재 진행 중인 투표</h2>
            <div className="flex justify-around items-center m-4">
              {/* 찬성 버튼 */}
              <button className="flex items-center justify-center p-2 bg-green-100 border-2 border-green-300 rounded-3xl">
                <Image
                  src="/icons/thumbs-up.svg"
                  alt="thumbs-up"
                  width={32}
                  height={32}
                  className="size-20"
                />
              </button>
              {/* 그림 */}
              <div className="relative flex items-center justify-center w-80 mx-6">
                <Image
                  src="/images/blackboard.png"
                  alt="blackboard"
                  width={898}
                  height={488}
                  className="max-w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/drawing.png"
                    alt="drawing"
                    width={135}
                    height={131}
                    className="h-3/5 w-auto object-contain"
                  />
                </div>
              </div>
              {/* 반대 버튼 */}
              <button className="flex items-center justify-center p-2 bg-red-100 border-2 border-red-300 rounded-3xl">
                <Image
                  src="/icons/thumbs-down.svg"
                  alt="thumbs-down"
                  width={32}
                  height={32}
                  className="size-20"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

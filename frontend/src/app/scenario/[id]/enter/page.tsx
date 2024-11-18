'use client'

import { useRouter } from 'next/navigation'
import SignButton from '@/app/_components/SignButton'
import { useEffect, useState } from 'react'
import { User, useUser } from '@/app/_contexts/UserContext'

export default function Enter() {
  const router = useRouter()
  const [roomId, setRoomId] = useState<string>('') // 방 코드
  const { user, setUser } = useUser() // 유저 정보
  const [errorText, setErrorText] = useState<string>('') // 에러 메시지
  const [isError, setIsError] = useState<boolean>(false) // 흔들림 상태

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value)
    setErrorText('')
  }

  // 흔들림 트리거
  const triggerShake = (message: string) => {
    setErrorText(message)
    setIsError(false)
    setTimeout(() => setIsError(true), 0)
  }

  const fetchExistRoom = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rooms/${roomId}`,
        {
          method: 'GET',
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch roomId')
      }

      const result = await response.json()

      return result.isExisting
    } catch (error) {
      console.error('Error fetching roomId:', error)
      return false
    }
  }

  // 에러 발생 흔들림
  useEffect(() => {
    if (errorText) {
      setIsError(true)
      const timer = setTimeout(() => {
        setIsError(false)
      }, 500) // 흔들림 지속 시간

      return () => clearTimeout(timer)
    }
  }, [errorText])

  const handleMove = async () => {
    if (!roomId.trim()) {
      triggerShake('방 코드를 입력해주세요')
      return
    }

    const isExists = await fetchExistRoom()

    if (!isExists) {
      triggerShake('존재하지 않는 방입니다')
      return
    }

    router.push(`/scenario/1/room/${roomId}`)
    setUser({ ...user, isHost: false } as User) // isHost 저장
  }

  return (
    <div className="p-28 w-screen h-screen bg-secondary-500 flex flex-col">
      <h1 className="text-6xl text-white font-outline-2 text-center select-none">
        방 코드를 입력해주세요
      </h1>
      {/* QR 코드 사진 추가하기 */}
      <div className="size-32"></div>
      <div className="flex h-full justify-center flex-col items-center">
        <div className="relative w-2/5">
          <div
            className={`flex bg-primary-600 border-4 border-primary-700 h-36 rounded-xl flex-col justify-center items-center ${
              isError ? 'animate-shake' : ''
            }`}
          >
            {/* 입력 필드 */}
            <input
              value={roomId}
              onChange={handleRoomCodeChange}
              type="text"
              placeholder="방코드 입력"
              className="w-full bg-transparent text-3xl text-center text-primary-800 outline-none placeholder:text-2xl placeholder:text-primary-700"
            />
            <hr className="w-3/4 border-b-2 border-white mt-2" />
          </div>
          {/* 에러 메시지 */}
          {errorText && (
            <p className="absolute text-red-400 text-xl top-full left-0 w-full text-center mt-2">
              {errorText}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end select-none">
        <SignButton content={'접속하기'} onClick={handleMove} />
      </div>
    </div>
  )
}

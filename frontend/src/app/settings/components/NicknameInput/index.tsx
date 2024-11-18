'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { User, useUser } from '@/app/_contexts/UserContext'

export default function NicknameInput() {
  const [nickname, setNickname] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { user, setUser } = useUser()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setNickname(user.nickname)
    }
  }, [user])

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value
    // 10자 제한
    if (newNickname.length <= 10) {
      setNickname(newNickname)
    }
  }

  const handleNicknameUpdate = async () => {
    if (user?.userId && nickname) {
      try {
        const response = await fetch(
          'https://mysafedraw.site/api/users/nickname',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.userId,
              nickname,
            }),
          },
        )
        if (response.ok) {
          setUser((prevUser) =>
            prevUser ? { ...prevUser, nickname } : prevUser,
          )
          setIsEditing(false)
        } else {
          console.error('Failed to update nickname')
        }
      } catch (error) {
        console.error('Error updating nickname:', error)
      }
    }
  }

  const focusInput = () => {
    setIsEditing(true)
    inputRef.current?.focus()
  }

  const handleClickEditButton = async () => {
    if (nickname.trim().length === 0) {
      alert('닉네임을 입력해주세요')
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/nickname`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            userId: user?.userId,
            nickname,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to post nickname')
      }

      setUser({ ...user, nickname } as User)
      alert('닉네임이 변경되었습니다.')
    } catch (error) {
      console.error('Error post nickname:', error)
      alert('닉네임 변경에 실패했습니다')
    }
  }

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user?.nickname)
    }
  }, [user])

  return (
    <div className="relative grid grid-cols-[1fr_3fr] items-center">
      <label className="text-4xl">닉네임</label>
      <div className="flex items-center h-full">
        <div className="relative w-full">
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            className="w-full px-6 py-3 bg-gray-white border border-gray-dark hover:outline-primary-500 focus:outline-primary-500 rounded-xl text-3xl"
          />
          {!isEditing && (
            <Image
              src="/icons/pencil.svg"
              alt="edit"
              width={32}
              height={32}
              className="absolute top-4 right-4 cursor-pointer"
              onClick={focusInput}
            />
          )}
        </div>
        <button
          onClick={handleNicknameUpdate}
          className={`h-full bg-primary-500 text-3xl rounded-lg transition-all duration-300 overflow-hidden text-nowrap ${isEditing ? 'w-28 ml-2' : 'w-0'}`}
        >
          변경
        </button>
      </div>
    </div>
  )
}

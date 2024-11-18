'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { User, useUser } from '@/app/_contexts/UserContext'

export default function NicknameInput() {
  const { user, setUser } = useUser()
  const [nickname, setNickname] = useState<string>('')

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNickname(e.target.value)

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
      <input
        type="text"
        value={nickname}
        onChange={handleNicknameChange}
        className="w-full px-6 py-3 bg-gray-white border border-gray-dark hover:outline-primary-500 focus:outline-primary-500 rounded-xl text-3xl"
      />
      <button className="absolute right-4" onClick={handleClickEditButton}>
        <Image src="/icons/pencil.svg" alt="edit" width={32} height={32} />
      </button>
    </div>
  )
}

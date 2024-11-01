'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function NicknameInput() {
  const [nickname, setNickname] = useState<string>('햄벅유경')

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNickname(e.target.value)

  return (
    <div className="relative grid grid-cols-[1fr_3fr] items-center">
      <label className="text-4xl">닉네임</label>
      <input
        type="text"
        value={nickname}
        onChange={handleNicknameChange}
        className="w-full px-6 py-3 bg-gray-white border border-gray-dark hover:outline-primary-500 focus:outline-primary-500 rounded-xl text-3xl"
      />
      <Image
        src="/icons/pencil.svg"
        alt="edit"
        width={32}
        height={32}
        className="absolute right-4"
      />
    </div>
  )
}

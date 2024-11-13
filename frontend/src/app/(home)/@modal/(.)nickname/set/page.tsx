'use client'

import { useRouter } from 'next/navigation'
import SirenIcon from '/public/icons/siren.svg'
import HelmetIcon from '/public/icons/helmet.svg'
import ProhibitionIcon from '/public/icons/prohibition.svg'
import BlinkerIcon from '/public/icons/blinker.svg'
import { useUser } from '@/app/_contexts/UserContext'
import { useEffect, useState } from 'react'

export default function SetNicknameModal() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const { user, setUser } = useUser()

  const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }

  const handleClickEnterButton = async () => {
    if (!user || nickname.trim().length <= 0) {
      alert('이름을 정해주세요')
      return
    }
    setUser({ ...user, nickname })
  }

  const postUser = async (): Promise<{
    avatarImg: string
    nickname: string
    userId: string
  }> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(user),
      },
    )

    if (!response.ok) {
      throw new Error('Failed to post user')
    }

    const result = await response.json()
    return result
  }

  useEffect(() => {
    const postUserInfo = async () => {
      try {
        if (user?.nickname) {
          const userInfo = await postUser()
          setUser({
            ...user,
            avatarImg: userInfo.avatarImg,
            userId: userInfo.userId,
          })
          router.back()
        }
      } catch (error) {
        console.error('Failed to post User:', error)
      }
    }

    postUserInfo()
  }, [user?.nickname])

  return (
    <div className="fixed top-0 w-full h-screen bg-[rgba(0,0,0,0.6)] inline-flex flex-col items-center justify-center gap-11 pb-[15vh] z-30">
      <SirenIcon className="w-36 top-24 left-52 absolute" />
      <HelmetIcon className="w-36 top-16 right-36 absolute" />
      <ProhibitionIcon className="w-36 left-16 bottom-20 absolute" />
      <BlinkerIcon className="w-20 right-16 bottom-36 absolute" />
      <div className="flex flex-col gap-8 bg-[rgba(256,256,256,0.6)] max-w-[44rem] w-full items-center py-7 rounded-lg px-16 absolute bottom-16">
        <h1 className="text-5xl text-text">이름을 정해보자</h1>
        <input
          type="text"
          value={nickname}
          placeholder="깜찍이"
          className="border-[5px] border-primary-500 py-4 text-center rounded-xl text-4xl placeholder:text-primary-200 outline-none w-full text-primary-700"
          onChange={handleChangeNickname}
        />
        <button
          className="gap-8 bg-primary-600 border-[5px] text-4xl border-primary-700 rounded-md text-white flex w-full items-center py-2 justify-center"
          onClick={handleClickEnterButton}
        >
          <SirenIcon className="h-16" />
          안전 나라로 접속하기
          <HelmetIcon className="h-16" />
        </button>
      </div>
    </div>
  )
}

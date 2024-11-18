'use client'

import Image from 'next/image'
import NicknameInput from './components/NicknameInput'
import GameVolumeControl from './components/GameVolumeControl'
import VolumeSlider from './components/VolumeSlider'
import MicTest from './components/MicTest'
import Link from 'next/link'
import { useUser } from '@/app/_contexts/UserContext'
import { useRouter } from 'next/navigation'

export default function Settings() {
  const { user } = useUser()
  const router = useRouter()

  return (
    <div className="p-20 pt-16 w-full h-full min-h-screen bg-secondary-500 flex flex-col">
      <div className="flex items-center drop-shadow-md mb-8">
        <button onClick={() => router.back()}>
          <Image
            src="/icons/back-arrow.svg"
            alt="back"
            width={60}
            height={60}
            className="h-12 w-auto"
          />
        </button>
        <h1 className="ml-6 text-6xl text-white">설정</h1>
      </div>
      <div className="p-16 flex flex-1 bg-white bg-opacity-80 rounded-xl">
        <div className="flex flex-col items-center">
          <div className="relative size-44 select-none bg-primary-400 rounded-full">
            {user?.avatarImg ? (
              <Image
                src={user?.avatarImg}
                alt="tiger"
                fill
                sizes="176px"
                className="bg-primary-400 rounded-full object-cover object-top pt-4"
                priority
                draggable={false}
              />
            ) : null}
          </div>
          <Link
            href={'/settings/character'}
            className="mt-5 w-full rounded-xl overflow-hidden border-2 border-primary-500"
          >
            <button className="w-full py-2.5 bg-white text-primary-600 text-3xl">
              캐릭터 변경
            </button>
          </Link>
        </div>
        <div className="ml-10 px-6 flex-grow space-y-16 w-full">
          <NicknameInput />
          <GameVolumeControl />
          <div className="grid grid-cols-[1fr_3fr]">
            <label className="text-4xl">음성</label>
            <div className="flex flex-col gap-8">
              <VolumeSlider label="스피커" />
              <VolumeSlider label="마이크" />
              <MicTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Image from 'next/image'
import NicknameInput from './components/NicknameInput'
import GameVolumeControl from './components/GameVolumeControl'
import VolumeSlider from './components/VolumeSlider'
import MicTest from './components/MicTest'

export default function Settings() {
  return (
    <div className="p-20 w-screen min-h-screen bg-secondary-500 flex flex-col">
      <div className="flex items-center drop-shadow-md mb-10">
        <Image
          src="/icons/back-arrow.svg"
          alt="back"
          width={60}
          height={60}
          className="h-12 w-auto"
        />
        <h1 className="ml-6 text-6xl text-white">설정</h1>
      </div>
      <div className="p-16 flex flex-1 bg-white bg-opacity-80 rounded-xl">
        <div className="flex flex-col items-center">
          <div className="relative size-44">
            <Image
              src="/images/tiger.png"
              alt="tiger"
              fill
              sizes="176px"
              className="bg-primary-400 rounded-full object-cover object-top pt-4"
              priority
            />
          </div>
          <button className="mt-5 w-full py-2.5 bg-white border-2 border-primary-500 rounded-xl text-primary-600 text-3xl">
            캐릭터 변경
          </button>
        </div>
        <div className="ml-10 px-6 flex-grow space-y-16">
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

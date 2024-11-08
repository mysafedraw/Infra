// components/LoadingScreen.tsx
import Image from 'next/image'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-secondary-500 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <Image
            src="/images/tiger.png"
            alt="loading"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          교실에 입장하고 있어요
        </h2>
        <p className="text-2xl text-white/80">잠시만 기다려 주세요...</p>
      </div>
    </div>
  )
}

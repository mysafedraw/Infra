import CharacterDialogue from '@/app/scenario/components/CharacterDialogue'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function StoryLayout({
  speechText = '이번에는 불이 엄청 크게 붙었네. 내가 끌 수 없을 것 같아. 어떻게 해야 할까?',
  children,
  isSpeechVisible = false,
}: {
  speechText: string
  children: React.ReactNode
  isSpeechVisible: boolean
}) {
  const router = useRouter()

  return (
    <div>
      <main>{children}</main>
      <div className="absolute inset-0 pointer-events-none">
        <div className="flex flex-row items-center p-4">
          <Image
            src="/icons/back-arrow.svg"
            alt="back"
            width={60}
            height={60}
            className="h-12 w-auto cursor-pointer pointer-events-auto"
            onClick={() => router.back()}
          />
          <div className="bg-white border-primary-500 border-4 p-4 px-12 rounded-3xl ml-4">
            <h3 className="text-2xl font-bold">화재 시나리오</h3>
          </div>
        </div>
        {isSpeechVisible ? (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end whitespace-pre-line">
              <CharacterDialogue speechText={speechText} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

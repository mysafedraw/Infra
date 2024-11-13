import Head from 'next/head'
import CharacterDialogue from '@/app/scenario/[id]/situation/components/CharacterDialogue'
import SituationHeader from '@/app/scenario/[id]/situation/components/SituationHeader'

interface StoryLayoutProp {
  speechText?: string
  children: React.ReactNode
  isSpeechVisible?: boolean
  showNextButton?: boolean
}

export default function StoryLayout({
  speechText = '이번에는 불이 엄청 크게 붙었네. 내가 끌 수 없을 것 같아. 어떻게 해야 할까?',
  children,
  isSpeechVisible = false,
  showNextButton = false,
}: StoryLayoutProp) {
  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <main>{children}</main>
      <div className="absolute inset-0 pointer-events-none">
        <div className="flex flex-row items-center p-4">
          <div className="absolute inset-0 pointer-events-none">
            <SituationHeader
              title="화재 시나리오"
              showNextButton={showNextButton}
            />
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

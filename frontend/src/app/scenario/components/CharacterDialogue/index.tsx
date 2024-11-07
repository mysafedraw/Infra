import Image from 'next/image'

export default function CharacterDialogue({
  speechText,
}: {
  speechText: string
}) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
      <div className="flex items-end">
        <div className="relative inline-block py-3 px-10 w-11/12 bg-white border-4 border-primary-600 rounded-3xl shadow-md z-50">
          <p className="text-3xl text-gray-800">{speechText}</p>
          <div className="absolute right-[-11px] top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-t-4 border-r-4 border-primary-600 rotate-45"></div>
        </div>
        <Image
          src="/images/tiger.png"
          alt="character-dialogue"
          width={200}
          height={200}
          className="w-48 h-auto relative z-10"
        />
      </div>
    </div>
  )
}

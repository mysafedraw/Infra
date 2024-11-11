import { Character } from '@/app/(home)/page'
import Image from 'next/image'

export default function CharacterList({
  characters,
  setSelectedCharacter,
}: {
  characters: Character[]
  setSelectedCharacter: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <div className="w-1/2 h-full bg-[rgba(256,256,256,0.8)] rounded-2xl py-10 px-10">
      <div className="flex flex-col gap-14 overflow-y-auto h-full pr-4">
        {characters.map((character) => {
          return (
            <div
              key={character.id}
              className="flex gap-6 items-center cursor-pointer select-none"
              onClick={() => {
                setSelectedCharacter(character.id)
              }}
            >
              <p className="w-32 h-32 aspect-square overflow-hidden rounded-full bg-secondary-600 shadow-md shrink-0">
                <Image
                  src={character.profileImg}
                  alt="character-profile"
                  width={125}
                  height={125}
                  draggable={false}
                />
              </p>
              <div className="bg-white flex flex-col gap-3 justify-center shadow-md rounded-2xl px-7 py-5 w-full">
                <span className="text-3xl">{character.avatarName}</span>
                <div className="flex gap-2 text-2xl text-gray-dark flex-wrap">
                  {character.hashTagNameList.map((tag) => (
                    <span key={tag} className="whitespace-nowrap">
                      {`#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

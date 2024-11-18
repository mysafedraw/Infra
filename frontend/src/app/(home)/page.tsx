'use client'

import SelectCharacter from '@/app/_components/SelectCharacter'
import Splash from './components/Splash'
import Scroll from './components/Scroll'
import { useEffect, useState } from 'react'

export interface Character {
  id: number
  avatarName: string
  profileImg: string
  hashTagNameList: string[]
}

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([])

  const fetchCharacters: () => Promise<Character[]> = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/avatars/list`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch character list')
      }

      const result = await response.json()

      return result.data
    } catch (error) {
      console.error('Error fetching character list:', error)
      return []
    }
  }

  useEffect(() => {
    const getCharacters = async () => {
      const characterList = await fetchCharacters()
      setCharacters(characterList)
    }

    getCharacters()
  }, [])

  return (
    <div className="flex flex-col bg-main-gradient w-full overflow-auto">
      <Splash />
      <Scroll />
      <SelectCharacter characters={characters} />
    </div>
  )
}

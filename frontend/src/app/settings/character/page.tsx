'use client'

import SelectCharacter from '@/app/_components/SelectCharacter'
import { Character } from '@/app/(home)/page'
import { useUser } from '@/app/_contexts/UserContext'
import { useEffect, useState } from 'react'

export default function CharacterSetting() {
  const { user } = useUser()
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
  }, [user?.nickname])

  return (
    <div>
      <SelectCharacter
        characters={characters}
        existAvartarId={user?.avatarId}
        path={'setting'}
        background
      />
    </div>
  )
}

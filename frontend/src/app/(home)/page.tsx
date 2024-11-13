// import SelectCharacter from './components/SelectCharacter'
// import Splash from './components/Splash'
// import Scroll from './components/Scroll'

import dynamic from 'next/dynamic'

const SelectCharacter = dynamic(() => import('./components/SelectCharacter'), {
  ssr: false,
})
const Scroll = dynamic(() => import('./components/Scroll'), {
  ssr: false,
})
const Splash = dynamic(() => import('./components/Splash'), {
  ssr: false,
})

export interface Character {
  id: number
  avatarName: string
  profileImg: string
  hashTagNameList: string[]
}

async function fetchCharacter(): Promise<Character[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/avatars/list`,
      {
        method: 'GET',
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

export default async function Home() {
  const characters = await fetchCharacter()

  return (
    <div className="flex flex-col bg-main-gradient w-full overflow-auto">
      <Splash />
      <Scroll />
      <SelectCharacter characters={characters} />
    </div>
  )
}

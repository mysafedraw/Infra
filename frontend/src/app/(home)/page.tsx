import dynamic from 'next/dynamic'

const Splash = dynamic(() => import('./components/Splash'), { ssr: false })
const Scroll = dynamic(() => import('./components/Scroll'), { ssr: false })
const SelectCharcter = dynamic(() => import('./components/SelectCharacter'), {
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
    const response = await fetch(`https://mysafedraw.site/api/avatars/list`, {
      method: 'GET',
      cache: 'no-store',
    })

    console.log(response)

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
      <SelectCharcter characters={characters} />
    </div>
  )
}

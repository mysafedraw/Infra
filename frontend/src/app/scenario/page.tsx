import Map from '@/app/scenario/components/Map'

export interface Scenario {
  id: number
  name: string
  description: string
  imgUrl: string
}

async function fetchScenario(): Promise<Scenario[]> {
  try {
    const response = await fetch(`https://mysafedraw.site/api/scenarios`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch scenarios')
    }

    const result = await response.json()

    return result.data
  } catch (error) {
    console.error('Error fetching scenarios:', error)
    return []
  }
}

export default async function Home() {
  const scenarios = await fetchScenario()

  return (
    <div className="w-screen h-screen">
      <Map scenarios={scenarios} />
    </div>
  )
}

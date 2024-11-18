'use client'

import dynamic from 'next/dynamic'
import SuffocationFail from '@/app/scenario/[id]/situation/components/SuffocationFail'

function Step4Fail() {
  return <SuffocationFail />
}

export default dynamic(() => Promise.resolve(Step4Fail), { ssr: false })

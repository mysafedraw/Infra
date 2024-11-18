'use client'

import dynamic from 'next/dynamic'
import SuffocationFail from '@/app/scenario/[id]/situation/components/SuffocationFail'

function Step3Fail() {
  return <SuffocationFail />
}

export default dynamic(() => Promise.resolve(Step3Fail), { ssr: false })

'use client'

import { memo } from 'react'
import dynamic from 'next/dynamic'
import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'

const Fail = memo(function Fail() {
  return (
    <>
      <ambientLight intensity={1.3} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <ModelLoader
        path="/assets/scenario/fire-engine.glb"
        scale={[26, 26, 26]}
        position={[6, 1, 0]}
        rotation={[0, -1, 0]}
        animation={{
          timeScale: 0.5,
          loop: 0,
        }}
      />
    </>
  )
})
export default dynamic(() => Promise.resolve(Fail), { ssr: false })

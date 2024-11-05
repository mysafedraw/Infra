'use client'

import { useEffect, useState } from 'react'
import SelectCharcter from './components/SelectCharacter'
import Splash from './components/Splash'
import Scroll from './components/Scroll'
import { useGLTF } from '@react-three/drei'

export default function Home() {
  const { scene: cloudScene } = useGLTF('/assets/background/cloud.glb')
  const [isScroll, setIsScroll] = useState(false)

  const scrollToBottomSlowly = () => {
    const targetPosition = document.documentElement.scrollHeight
    let currentPosition = window.scrollY

    const interval = setInterval(() => {
      currentPosition += 10
      window.scrollTo(0, currentPosition)

      if (currentPosition >= targetPosition) {
        clearInterval(interval)
        // document.body.style.overflow = 'hidden'
      }
    }, 16)
  }

  useEffect(() => {
    if (isScroll) {
      document.body.style.position = 'static'
      document.body.style.top = `-${window.scrollY}px`
      document.body.style.width = '100%'
      scrollToBottomSlowly()
    } else {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
      document.body.style.width = '100%'
    }
  }, [isScroll])

  useEffect(() => {
    document.documentElement.classList.add('scrollbar-hide')
    useGLTF.preload('/assets/background/cloud.glb')

    return () => {
      document.documentElement.classList.remove('scrollbar-hide')
    }
  }, [])

  return (
    <div className="flex flex-col bg-main-gradient w-full overflow-auto">
      <Splash cloudScene={cloudScene} setIsScroll={setIsScroll} />
      <Scroll cloudScene={cloudScene} />
      <SelectCharcter />
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Splash = dynamic(() => import('./components/Splash'), { ssr: false })
const Scroll = dynamic(() => import('./components/Scroll'), { ssr: false })
const SelectCharcter = dynamic(() => import('./components/SelectCharacter'), {
  ssr: false,
})

export default function Home() {
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

    return () => {
      document.documentElement.classList.remove('scrollbar-hide')
    }
  }, [])

  return (
    <div className="flex flex-col bg-main-gradient w-full overflow-auto">
      <Splash setIsScroll={setIsScroll} />
      <Scroll />
      <SelectCharcter />
    </div>
  )
}

'use client'

import React, { createContext, useContext, useState } from 'react'

interface SpeakingRightInfo {
  userId: string
  nickname: string
  avatarsImgSrc: string
  drawingSrc: string
}

interface SpeakingRightContextProps {
  speakingRightInfo: SpeakingRightInfo | null
  setSpeakingRightInfo: (info: SpeakingRightInfo | null) => void
}

const SpeakingRightContext = createContext<
  SpeakingRightContextProps | undefined
>(undefined)

export const SpeakingRightProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [speakingRightInfo, setSpeakingRightInfo] =
    useState<SpeakingRightInfo | null>(null)

  return (
    <SpeakingRightContext.Provider
      value={{ speakingRightInfo, setSpeakingRightInfo }}
    >
      {children}
    </SpeakingRightContext.Provider>
  )
}

export const useSpeakingRight = () => {
  const context = useContext(SpeakingRightContext)
  if (!context) {
    throw new Error(
      'useSpeakingRight must be used within a SpeakingRightProvider',
    )
  }
  return context
}

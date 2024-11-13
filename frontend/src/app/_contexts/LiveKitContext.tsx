'use client'

import React, { createContext, useContext, useState } from 'react'
import { Room as LiveKitRoom, createLocalAudioTrack } from 'livekit-client'

interface LiveKitContextProps {
  voiceRoom?: LiveKitRoom
  createVoiceRoom: (roomName: string, participantName: string) => Promise<void>
  joinVoiceRoom: (roomName: string, participantName: string) => Promise<void>
}

const LiveKitContext = createContext<LiveKitContextProps | undefined>(undefined)

export const LiveKitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [voiceRoom, setVoiceRoom] = useState<LiveKitRoom | undefined>(undefined)

  const APPLICATION_SERVER_URL =
    'https://7697-211-192-252-94.ngrok-free.app/api/'
  const LIVEKIT_URL = 'wss://7697-211-192-252-94.ngrok-free.app/livekit'

  const getToken = async (roomName: string, participantName: string) => {
    const response = await fetch(`${APPLICATION_SERVER_URL}audio/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: roomName,
        userId: participantName,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get token: ${error.errorMessage}`)
    }

    const data = await response.json()
    return data.audioAccessToken
  }

  // 새로운 방 생성 함수
  const createVoiceRoom = async (roomName: string, participantName: string) => {
    const newRoom = new LiveKitRoom()
    try {
      const token = await getToken(roomName, participantName)
      await newRoom.connect(LIVEKIT_URL, token)
      setVoiceRoom(newRoom)

      const audioTrack = await createLocalAudioTrack()
      await newRoom.localParticipant.publishTrack(audioTrack)

      console.log('음성 채팅 방이 성공적으로 생성되었습니다.')
    } catch (error) {
      console.error('음성 채팅 방 생성 중 오류 발생:', error)
      await newRoom.disconnect()
    }
  }

  // 기존 방에 참여하는 함수
  const joinVoiceRoom = async (roomName: string, participantName: string) => {
    if (voiceRoom) return // 이미 방에 참여 중이면 중복 참여 방지

    const newRoom = new LiveKitRoom()
    try {
      const token = await getToken(roomName, participantName)
      await newRoom.connect(LIVEKIT_URL, token)
      setVoiceRoom(newRoom)

      const audioTrack = await createLocalAudioTrack()
      await newRoom.localParticipant.publishTrack(audioTrack)

      console.log(`참여자 ${participantName}가 음성 채팅 방에 입장했습니다.`)
    } catch (error) {
      console.error('음성 채팅 방 참여 중 오류 발생:', error)
      await newRoom.disconnect()
    }
  }

  return (
    <LiveKitContext.Provider
      value={{ voiceRoom, createVoiceRoom, joinVoiceRoom }}
    >
      {children}
    </LiveKitContext.Provider>
  )
}

export const useLiveKit = () => {
  const context = useContext(LiveKitContext)
  if (!context)
    throw new Error('useLiveKit must be used within LiveKitProvider')
  return context
}

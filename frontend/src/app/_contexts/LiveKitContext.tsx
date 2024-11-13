'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Room as LiveKitRoom, createLocalAudioTrack } from 'livekit-client'
import { useSpeakingRight } from '@/app/_contexts/SpeakingRight'
import { useUser } from '@/app/_contexts/UserContext'

interface LiveKitContextProps {
  voiceRoom?: LiveKitRoom
  createVoiceRoom: (roomId: string, userId: string) => Promise<void>
  joinVoiceRoom: (roomId: string, userId: string) => Promise<void>
  toggleMute: (userId: string, mute: boolean) => void // 특정 사용자의 마이크 상태를 제어
  isHostMuted: boolean
  setIsHostMuted: React.Dispatch<React.SetStateAction<boolean>>
}

const LiveKitContext = createContext<LiveKitContextProps | undefined>(undefined)

export const LiveKitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [voiceRoom, setVoiceRoom] = useState<LiveKitRoom | undefined>(undefined)
  const { speakingRightInfo } = useSpeakingRight()
  const { user } = useUser()
  const [isHostMuted, setIsHostMuted] = useState(true) // 방장의 마이크 상태를 저장

  const APPLICATION_SERVER_URL =
    'https://0580-211-192-252-94.ngrok-free.app/api/'
  const LIVEKIT_URL = 'wss://0580-211-192-252-94.ngrok-free.app/livekit'

  const getToken = async (roomId: string, userId: string) => {
    const response = await fetch(`${APPLICATION_SERVER_URL}audio/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: roomId,
        userId: userId,
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
  const createVoiceRoom = async (roomId: string, userId: string) => {
    const newRoom = new LiveKitRoom()
    try {
      const token = await getToken(roomId, userId)
      await newRoom.connect(LIVEKIT_URL, token)
      setVoiceRoom(newRoom)

      const audioTrack = await createLocalAudioTrack()
      await newRoom.localParticipant.publishTrack(audioTrack)

      // 방장 초기 입장 시 음소거 설정
      audioTrack.mute()
      setIsHostMuted(true)

      console.log('음성 채팅 방이 성공적으로 생성되었습니다.')
    } catch (error) {
      console.error('음성 채팅 방 생성 중 오류 발생:', error)
      await newRoom.disconnect()
    }
  }

  // 기존 방에 참여하는 함수
  const joinVoiceRoom = async (roomId: string, userId: string) => {
    if (voiceRoom) return // 이미 방에 참여 중이면 중복 참여 방지

    const newRoom = new LiveKitRoom()
    try {
      const token = await getToken(roomId, userId)
      await newRoom.connect(LIVEKIT_URL, token)
      setVoiceRoom(newRoom)

      const audioTrack = await createLocalAudioTrack()
      await newRoom.localParticipant.publishTrack(audioTrack)

      // 참여자는 기본적으로 음소거 상태로 시작
      audioTrack.mute()

      console.log(`참여자 ${userId}가 음성 채팅 방에 입장했습니다.`)
    } catch (error) {
      console.error('음성 채팅 방 참여 중 오류 발생:', error)
      await newRoom.disconnect()
    }
  }

  // 특정 사용자의 마이크 음소거/해제 함수
  const toggleMute = useCallback(
    (targetUserId: string, mute: boolean) => {
      console.log(
        `toggleMute called with targetUserId: ${targetUserId}, mute: ${mute}`,
      )

      voiceRoom?.localParticipant.audioTrackPublications.forEach(
        (publication) => {
          if (
            publication.track &&
            voiceRoom.localParticipant.identity === targetUserId
          ) {
            if (mute) {
              publication.track.mute()
              console.log(`${targetUserId} 뮤트함`)
            } else {
              publication.track.unmute()
              console.log(`${targetUserId} 뮤트 해제함`)
            }
          }
        },
      )
      // 방장의 경우 상태 업데이트
      if (user?.userId === targetUserId) {
        setIsHostMuted(mute)
      }
    },
    [
      user?.userId,
      voiceRoom?.localParticipant.audioTrackPublications,
      voiceRoom?.localParticipant.identity,
    ],
  )

  // 발언권 상태에 따른 마이크 제어
  useEffect(() => {
    if (voiceRoom) {
      if (speakingRightInfo?.userId) {
        toggleMute(speakingRightInfo.userId, false)
      }
    }
  }, [speakingRightInfo, toggleMute, voiceRoom])

  return (
    <LiveKitContext.Provider
      value={{
        voiceRoom,
        createVoiceRoom,
        joinVoiceRoom,
        toggleMute,
        isHostMuted,
        setIsHostMuted,
      }}
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

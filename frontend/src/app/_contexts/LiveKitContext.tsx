'use client'

import React, { createContext, useContext, useRef, useState } from 'react'
import {
  createLocalAudioTrack,
  LocalAudioTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from 'livekit-client'

interface TrackInfo {
  trackPublication: RemoteTrackPublication
  participantIdentity: string
}

interface LiveKitContextProps {
  joinVoiceRoom: (roomName: string, participantName: string) => Promise<void>
  leaveVoiceRoom: () => Promise<void>
  toggleMicrophone: () => void
  enableMicForSpeakingRights: (
    roomName: string,
    participantName: string,
  ) => Promise<void>
  isMuted: boolean
  remoteAudioTracks: TrackInfo[]
}

const LiveKitContext = createContext<LiveKitContextProps | undefined>(undefined)

const APPLICATION_SERVER_URL = 'https://26ed-211-192-252-94.ngrok-free.app/api/'
const LIVEKIT_URL = 'wss://26ed-211-192-252-94.ngrok-free.app/livekit'

export const LiveKitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMuted, setIsMuted] = useState(true)
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<TrackInfo[]>([])
  const voiceRoomRef = useRef<Room | undefined>(undefined)
  const localAudioTrackRef = useRef<LocalAudioTrack | undefined>(undefined)

  const getToken = async (roomName: string, participantName: string) => {
    const response = await fetch(APPLICATION_SERVER_URL + 'audio/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomName, userId: participantName }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get token: ${error.errorMessage}`)
    }
    const data = await response.json()
    return data.audioAccessToken
  }

  // 음성 채팅 방을 떠나는 함수
  const leaveVoiceRoom = async () => {
    if (voiceRoomRef.current) {
      await voiceRoomRef.current.disconnect()
      voiceRoomRef.current = undefined
      localAudioTrackRef.current = undefined
      setRemoteAudioTracks([])
      console.log('음성 채팅 방을 떠났습니다.')
    }
  }

  // 음성 채팅 방에 참여하는 함수
  const joinVoiceRoom = async (roomName: string, participantName: string) => {
    if (voiceRoomRef.current) return

    const voiceRoom = new Room()
    voiceRoomRef.current = voiceRoom

    voiceRoom.on(
      RoomEvent.TrackSubscribed,
      (track, publication, participant) => {
        if (track.kind === 'audio') {
          setRemoteAudioTracks((prev) => [
            ...prev,
            {
              trackPublication: publication,
              participantIdentity: participant.identity,
            },
          ])
        }
      },
    )

    voiceRoom.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
      setRemoteAudioTracks((prev) =>
        prev.filter(
          (track) => track.trackPublication.trackSid !== publication.trackSid,
        ),
      )
    })

    try {
      const token = await getToken(roomName, participantName)
      await voiceRoom.connect(LIVEKIT_URL, token)

      // 로컬 오디오 트랙을 생성하지만 바로 발행하지 않음 (청취자 모드로만 입장)
      const audioTrack = await createLocalAudioTrack()
      localAudioTrackRef.current = audioTrack
      setIsMuted(true)

      console.log(
        'Successfully connected to the voice chat room as a listener.',
      )
    } catch (error) {
      console.error(
        'Error connecting to the voice chat room:',
        (error as Error).message,
      )
      await leaveVoiceRoom()
    }
  }

  // 발언권 부여 후 마이크 켜기
  const enableMicForSpeakingRights = async (
    roomName: string,
    participantName: string,
  ) => {
    if (!voiceRoomRef.current) {
      console.log('Room not connected. Attempting to join the room.')

      // 방에 참여
      await joinVoiceRoom(roomName, participantName)

      if (!voiceRoomRef.current) {
        console.warn('Failed to join the room. Cannot enable the microphone.')
        return
      }
    }

    if (localAudioTrackRef.current) {
      // 로컬 오디오 트랙 발행 (마이크 켜기)
      await voiceRoomRef.current.localParticipant.publishTrack(
        localAudioTrackRef.current,
      )
      await localAudioTrackRef.current.unmute()
      setIsMuted(false)
      console.log('Microphone enabled for speaking rights.')
    }
  }

  // 마이크 음소거/해제 함수
  const toggleMicrophone = () => {
    if (localAudioTrackRef.current) {
      if (isMuted) {
        localAudioTrackRef.current.unmute()
        console.log('마이크 켬')
      } else {
        localAudioTrackRef.current.mute()
        console.log('마이크 끔')
      }
      setIsMuted((prev) => !prev)
    }
  }

  return (
    <LiveKitContext.Provider
      value={{
        joinVoiceRoom,
        leaveVoiceRoom,
        toggleMicrophone,
        enableMicForSpeakingRights,
        isMuted,
        remoteAudioTracks,
      }}
    >
      {children}
    </LiveKitContext.Provider>
  )
}

export const useLiveKit = () => {
  const context = useContext(LiveKitContext)
  if (!context) {
    throw new Error('useLiveKit must be used within LiveKitProvider')
  }
  return context
}

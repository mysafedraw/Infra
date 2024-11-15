'use client'

import React, { createContext, useContext, useRef, useState } from 'react'
import {
  createLocalAudioTrack,
  LocalAudioTrack,
  Participant,
  RemoteParticipant,
  RemoteTrack,
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
  muteMicrophone: () => void
  enableMicForSpeakingRights: (
    roomName: string,
    participantName: string,
  ) => Promise<void>
  isMuted: boolean
  remoteAudioTracks: TrackInfo[]
}

const LiveKitContext = createContext<LiveKitContextProps | undefined>(undefined)

const APPLICATION_SERVER_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`
const LIVEKIT_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/livekit`

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
    if (voiceRoomRef.current) return // 이미 참여 중이면 리턴

    const voiceRoom = new Room()
    voiceRoomRef.current = voiceRoom

    // 트랙 구독 이벤트 등록
    voiceRoom.on(
      RoomEvent.TrackSubscribed,
      (
        _track: RemoteTrack,
        publication: RemoteTrackPublication,
        participant: RemoteParticipant,
      ) => {
        // 오디오 트랙이 구독된 경우, 오디오 요소에 연결하여 출력
        if (_track.kind === 'audio') {
          const audioElement = new Audio()
          audioElement.srcObject = new MediaStream([_track.mediaStreamTrack]) // 오디오 트랙을 오디오 요소에 연결
          audioElement.play().catch((error) => {
            console.error('Audio play error:', error)
          })
        }

        setRemoteAudioTracks((prev) => [
          ...prev,
          {
            trackPublication: publication,
            participantIdentity: participant.identity,
          },
        ])
      },
    )

    // 트랙 구독 해제 이벤트 등록
    voiceRoom.on(
      RoomEvent.TrackUnsubscribed,
      (_track: RemoteTrack, publication: RemoteTrackPublication) => {
        setRemoteAudioTracks((prev) =>
          prev.filter(
            (track) => track.trackPublication.trackSid !== publication.trackSid,
          ),
        )
      },
    )

    // 참가자 연결 및 연결 해제 이벤트 등록
    voiceRoom.on(RoomEvent.ParticipantConnected, (participant: Participant) => {
      console.log(`Participant connected: ${participant.identity}`)
    })

    voiceRoom.on(
      RoomEvent.ParticipantDisconnected,
      (participant: Participant) => {
        console.log(`Participant disconnected: ${participant.identity}`)
      },
    )

    try {
      const token = await getToken(roomName, participantName)
      await voiceRoom.connect(LIVEKIT_URL, token)

      // 로컬 오디오 트랙을 생성하고 트랙 발행 및 뮤트 설정
      const audioTrack = await createLocalAudioTrack()
      localAudioTrackRef.current = audioTrack
      await voiceRoom.localParticipant.publishTrack(audioTrack)
      await audioTrack.mute() // 음소거 상태로 시작
      setIsMuted(true)

      console.log('Local audio track published and muted:', audioTrack)
      console.log('Connected to voice room as a listener.')
      console.log('Current room name:', voiceRoomRef.current?.name)

      // 현재 연결된 원격 참가자들 로그 출력
      const participants = Array.from(
        voiceRoomRef.current.remoteParticipants.values(),
      )
      console.log('Remote participants:')
      participants.forEach((participant) => {
        console.log(`Participant ID: ${participant.identity}`)
      })
    } catch (error) {
      console.error('Error connecting to voice room:', (error as Error).message)
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

  // 마이크 음소거
  const muteMicrophone = () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.mute()
      setIsMuted(true)
      console.log('Microphone has been muted.')
    }
  }

  return (
    <LiveKitContext.Provider
      value={{
        joinVoiceRoom,
        leaveVoiceRoom,
        toggleMicrophone,
        muteMicrophone,
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

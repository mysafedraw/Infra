'use client'

import React, { createContext, useContext, useRef, useState } from 'react'
import { OpenVidu, Session, StreamManager, Publisher } from 'openvidu-browser'

interface TrackInfo {
  streamManager: StreamManager
  participantIdentity: string
}

interface OpenViduContextProps {
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

const OpenViduContext = createContext<OpenViduContextProps | undefined>(
  undefined,
)

const APPLICATION_SERVER_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`

export const OpenViduProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMuted, setIsMuted] = useState(true)
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<TrackInfo[]>([])
  const sessionRef = useRef<Session | undefined>(undefined)
  const publisherRef = useRef<Publisher | undefined>(undefined)

  const createSession = async (customSessionId: string): Promise<string> => {
    const response = await fetch(APPLICATION_SERVER_URL + 'audio/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customSessionId }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create session: ${error.errorMessage}`)
    }
    const data = await response.json()
    return data.data // sessionId
  }

  const createToken = async (sessionId: string): Promise<string> => {
    const response = await fetch(
      `${APPLICATION_SERVER_URL}audio/sessions/${sessionId}/connections`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
    )
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create token: ${error.errorMessage}`)
    }
    const data = await response.json()
    return data.data // token
  }

  const getToken = async (roomName: string): Promise<string> => {
    const sessionId = await createSession(roomName)
    return createToken(sessionId)
  }

  const leaveVoiceRoom = async () => {
    if (sessionRef.current) {
      sessionRef.current.disconnect()
      sessionRef.current = undefined
      publisherRef.current = undefined
      setRemoteAudioTracks([])
      console.log('Left voice room.')
    }
  }

  const joinVoiceRoom = async (roomName: string, participantName: string) => {
    if (sessionRef.current) return

    const OV = new OpenVidu()
    const session = OV.initSession()
    sessionRef.current = session

    session.on('streamCreated', (event) => {
      console.log('Stream created:', event.stream)

      const isRemoteStream =
        event.stream.connection.connectionId !== session.connection.connectionId

      if (!isRemoteStream) {
        console.log('Skipping local stream.')
        return
      }

      try {
        const subscriber = session.subscribe(event.stream, undefined)

        const tryGetMediaStream = (attempts: number) => {
          const mediaStream = subscriber.stream.getMediaStream()
          if (mediaStream) {
            console.log('MediaStream retrieved successfully:', mediaStream)

            const audioElement = document.createElement('audio')
            audioElement.srcObject = mediaStream
            audioElement.autoplay = true

            audioElement
              .play()
              .then(() => {
                console.log('Audio playback started successfully.')
              })
              .catch((error) => {
                console.error('Audio playback failed:', error)
              })
          } else if (attempts > 0) {
            console.warn('MediaStream not ready. Retrying...')
            setTimeout(() => tryGetMediaStream(attempts - 1), 100)
          } else {
            console.error('Failed to retrieve MediaStream after retries.')
          }
        }

        tryGetMediaStream(5) // 최대 5번 재시도
      } catch (error) {
        console.error('Error subscribing to stream:', error)
      }
    })

    session.on('streamDestroyed', (event) => {
      console.log('Stream destroyed:', event.stream)
      setRemoteAudioTracks((prev) =>
        prev.filter(
          (track) => track.streamManager !== event.stream.streamManager,
        ),
      )
    })

    try {
      const token = await getToken(roomName)
      await session.connect(token, { clientData: participantName })

      const publisher = OV.initPublisher(undefined, {
        audioSource: true,
        videoSource: false,
        publishAudio: false,
        publishVideo: false,
        mirror: false,
      })

      await session.publish(publisher)
      publisherRef.current = publisher

      setIsMuted(true)

      console.log('Joined voice room and published local audio track.')
    } catch (error) {
      console.error('Error connecting to voice room:', error)
      await leaveVoiceRoom()
    }
  }

  const toggleMicrophone = () => {
    if (publisherRef.current) {
      if (isMuted) {
        publisherRef.current.publishAudio(true)
        console.log('Microphone unmuted.')
      } else {
        publisherRef.current.publishAudio(false)
        console.log('Microphone muted.')
      }
      setIsMuted((prev) => !prev)
    }
  }

  const muteMicrophone = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(false)
      setIsMuted(true)
      console.log('Microphone has been muted.')
    }
  }

  const enableMicForSpeakingRights = async (
    roomName: string,
    participantName: string,
  ) => {
    if (!sessionRef.current) {
      console.log('Room not connected. Attempting to join the room.')
      await joinVoiceRoom(roomName, participantName)
    }

    if (publisherRef.current) {
      publisherRef.current.publishAudio(true)
      setIsMuted(false)
      console.log('Microphone enabled for speaking rights.')
    }
  }

  return (
    <OpenViduContext.Provider
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
    </OpenViduContext.Provider>
  )
}

export const useOpenVidu = () => {
  const context = useContext(OpenViduContext)
  if (!context) {
    throw new Error('useOpenVidu must be used within OpenViduProvider')
  }
  return context
}

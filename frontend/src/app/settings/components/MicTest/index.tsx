'use client'

import { useEffect, useRef, useState } from 'react'

export default function MicTest() {
  const [micTestValue, setMicTestValue] = useState<number>(0)
  const [numBars, setNumBars] = useState<number>(50)
  const [recording, setRecording] = useState<boolean>(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const updateNumBars = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const barWidth = 4
        const gap = 4
        setNumBars(Math.floor(containerWidth / (barWidth + gap)))
      }
    }

    updateNumBars()
    window.addEventListener('resize', updateNumBars)
    return () => window.removeEventListener('resize', updateNumBars)
  }, [])

  const updateMicTestValue = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current)
      const avgVolume =
        dataArrayRef.current.reduce((a, b) => a + b) /
        dataArrayRef.current.length
      setMicTestValue(avgVolume)
    }
    requestAnimationFrame(updateMicTestValue)
  }

  const stopMicTest = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
      analyserRef.current = null
      dataArrayRef.current = null
      setMicTestValue(0)
    }
  }

  const startMicTest = async () => {
    setRecording(true)
    audioContextRef.current = new AudioContext()
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const source = audioContextRef.current.createMediaStreamSource(stream)
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 256
    dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount)
    source.connect(analyserRef.current)

    const recorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []

    recorder.ondataavailable = (event) => {
      chunks.push(event.data)
    }

    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' })
      setRecordedAudio(audioBlob)
      stopMicTest() // 녹음 종료 및 그래프 정지
      setRecording(false) // 녹음 상태 해제
    }

    recorder.start()
    updateMicTestValue() // 녹음 시작 시에 updateMicTestValue 호출

    setTimeout(() => {
      recorder.stop()
    }, 3000) // 3초 후 녹음 종료
  }

  const playRecordedAudio = () => {
    if (recordedAudio) {
      const audioUrl = URL.createObjectURL(recordedAudio)
      audioPlayerRef.current = new Audio(audioUrl)
      audioPlayerRef.current.play()
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaElementSource(
        audioPlayerRef.current,
      )
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      dataArrayRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount,
      )
      source.connect(analyserRef.current)
      source.connect(audioContextRef.current.destination)

      updateMicTestValue()
    }
  }

  return (
    <div>
      ``
      <label className="mr-4 text-3xl">마이크 테스트</label>
      <p className="text-gray-dark text-xl">
        테스트를 시작하고 아무 말이나 해보세요. 3초간 녹음 후 다시 들려
        드릴게요.
      </p>
      <div className="grid grid-cols-[96px_auto] gap-4 items-center mt-3">
        {recordedAudio && !recording ? (
          <button
            onClick={playRecordedAudio}
            className="py-2 bg-primary-500 text-xl text-white rounded-lg"
          >
            재생하기
          </button>
        ) : (
          <button
            onClick={recording || recordedAudio ? undefined : startMicTest}
            className={`py-2 rounded-lg text-xl bg-white ${
              recording
                ? 'border-2 border-primary-500 text-primary-500'
                : 'border-2 border-gray-dark'
            }`}
          >
            {recording ? '녹음 중...' : '테스트'}
          </button>
        )}

        <div
          ref={containerRef}
          className="flex gap-1 overflow-hidden h-10 w-full"
        >
          {Array.from({ length: numBars }).map((_, index) => (
            <div
              key={index}
              className={`h-full w-1 rounded ${
                index < (micTestValue / 100) * numBars
                  ? 'bg-primary-500'
                  : 'bg-gray-dark'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

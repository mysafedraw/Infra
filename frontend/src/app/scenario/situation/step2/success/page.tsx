'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import ARController from '@/app/scenario/components/ARController'
import Step2 from '@/app/scenario/situation/step2/components/Success'
import StoryLayout from '@/app/scenario/components/StoryLayout'

export type ReportingState = 'ready' | 'processing' | 'complete'

function SituationStep2() {
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0) // 3일 경우 119 입력 완료
  const [reportingState, setReportingState] = useState<ReportingState>('ready')
  const [speech, setSpeech] = useState(
    '"와! 빠르게 119에 신고한 덕분에 벌써 소방차가 오고 있어!"',
  )

  useEffect(() => {
    if (currentAnimationIndex === 3) {
      setReportingState('processing')
      setTimeout(() => setReportingState('complete'), 3000) // 3초 후 신고 완료
    }
  }, [currentAnimationIndex])

  return (
    <StoryLayout
      isSpeechVisible={reportingState === 'complete'}
      speechText={speech}
    >
      <div className="fixed inset-0">
        <Canvas
          camera={{
            position: [0, 2, 5],
            near: 0.1,
            far: 2000,
            fov: 75,
          }}
          shadows
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
          }}
        >
          <ambientLight intensity={1.3} color="#ffffff" />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            color="#ffffff"
          />

          <Step2
            reportingState={reportingState}
            currentAnimationIndex={currentAnimationIndex}
            setCurrentAnimationIndex={setCurrentAnimationIndex}
            setSpeech={setSpeech}
          />

          <ARController>
            <ambientLight intensity={0.5} />
            <pointLight
              position={[0, 2, 0]}
              intensity={2}
              color="#ff7700"
              distance={10}
              decay={2}
            />
            <spotLight
              position={[0, 5, 2]}
              angle={0.5}
              penumbra={0.5}
              intensity={1}
              castShadow
            />
          </ARController>
        </Canvas>
      </div>
    </StoryLayout>
  )
}

export default dynamic(() => Promise.resolve(SituationStep2), { ssr: false })

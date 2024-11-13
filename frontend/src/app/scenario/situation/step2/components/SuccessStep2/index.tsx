'use client'

import { memo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, LoopOnce } from 'three'

function FireEngineModel() {
  const { scene: fireEngineScene, animations } = useGLTF(
    '/assets/scenario/fire-engine.glb',
  )
  const mixer = new AnimationMixer(fireEngineScene)

  useEffect(() => {
    const action = mixer.clipAction(animations[0])
    action.setLoop(LoopOnce, 0)
    action.clampWhenFinished = true
    action.timeScale = 0.5
    action.play()

    return () => {
      action.stop()
      mixer.uncacheClip(animations[0])
    }
  }, [mixer, animations])

  useFrame((_, delta) => mixer.update(delta))

  return (
    <primitive
      object={fireEngineScene}
      dispose={null}
      scale={[26, 26, 26]}
      position={[6, 1, 0]}
      rotation={[0, -1, 0]}
    />
  )
}

const Fail = memo(function Fail() {
  return (
    <>
      <ambientLight intensity={1.3} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <FireEngineModel />
    </>
  )
})
export default dynamic(() => Promise.resolve(Fail), { ssr: false })

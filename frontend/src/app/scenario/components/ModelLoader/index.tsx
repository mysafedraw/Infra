'use client'

import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface ModelLoaderProps {
  path: string // 모델 파일 경로
  position?: [number, number, number] // 모델 위치
  scale?: [number, number, number] // 모델 스케일
  rotation?: [number, number, number] // 모델 회전
  castShadow?: boolean // 그림자 설정
  receiveShadow?: boolean // 그림자 수신 설정
  onLoad?: (model: THREE.Group) => void // 모델이 로드될 때 실행할 콜백
}

export default function ModelLoader({
  path,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  onLoad,
}: ModelLoaderProps) {
  const { scene: originalScene, animations } = useGLTF(path)
  const scene = originalScene.clone()
  const modelRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)

  useEffect(() => {
    if (scene && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene)
      const action = mixerRef.current.clipAction(animations[0])
      action.setLoop(THREE.LoopRepeat, Infinity)
      action.clampWhenFinished = true
      action.timeScale = 1
      action.play()

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = castShadow
          child.receiveShadow = receiveShadow
        }
      })

      if (onLoad && modelRef.current) {
        onLoad(modelRef.current)
      }

      return () => {
        action.stop()
        mixerRef.current?.uncacheClip(animations[0])
      }
    }
  }, [animations, scene, castShadow, receiveShadow, onLoad])

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
  })

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  )
}

// 모델 프리로드
useGLTF.preload('/models/fire.glb')
useGLTF.preload('/models/bucket.glb')

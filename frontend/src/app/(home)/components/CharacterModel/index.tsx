import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, MathUtils, Vector3 } from 'three'
import { useRouter } from 'next/navigation'

export default function CharacterModel({ url }: { url: string }) {
  const router = useRouter()
  const { scene: characterScene, animations } = useGLTF(url)
  const mixer = useRef<AnimationMixer | null>(null)
  const characterPosition = useRef(new Vector3(0, -6, 0))
  const moveSpeed = 0.05
  const intervalId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    mixer.current = new AnimationMixer(characterScene)
    const action = mixer.current.clipAction(animations[0])
    action.play()

    return () => {
      mixer.current?.stopAllAction()
    }
  }, [animations, characterScene])

  useEffect(() => {
    // 몇초 후에 회전하도록 수정
    rotateCharacter(80)

    const characterMoveTimeout = setTimeout(() => {
      intervalId.current = setInterval(() => {
        moveCharacter(
          characterScene.position.x + 2,
          characterScene.position.y,
          characterScene.position.z,
        )
      }, 20)
    }, 3000)

    // const routeTimeout = setTimeout(() => {
    //   router.push('/scenario')
    // }, 5000)
  }, [])

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta)
    }

    characterScene.position.lerp(characterPosition.current, moveSpeed)
  })

  // 캐릭터 회전
  const rotateCharacter = (degrees: number) => {
    const radians = MathUtils.degToRad(degrees)
    characterScene.rotation.y += radians
  }

  // 캐릭터 이동
  const moveCharacter = (x: number, y: number, z: number) => {
    characterPosition.current.set(x, y, z)
  }

  return (
    <primitive object={characterScene} dispose={null} scale={[0.1, 0.1, 0.1]} />
  )
}

/* eslint-disable react-hooks/rules-of-hooks */

'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { User, useUser } from '@/app/_contexts/UserContext'
import { Scenario } from '@/app/scenario/page'
import { Group, Object3DEventMap } from 'three'
import ScenarioPopup from '../ScenarioPopup'

const CHARACTER_ASSETS: Record<number, string> = {
  1: '/assets/character/dog.glb',
  2: '/assets/character/tiger.glb',
  3: '/assets/character/bunny.glb',
  4: '/assets/character/fox.glb',
  5: '/assets/character/penguin.glb',
  6: '/assets/character/unicorn.glb',
  7: '/assets/character/cat.glb',
}

// 캐릭터 설정
const useCharacter = (user: User | null) => {
  const { scene } = useThree()
  const character = useRef<Group<Object3DEventMap> | null>(null)
  const train = useRef<Group<Object3DEventMap> | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const characterScene = useMemo(
    () => (avatar ? useGLTF(avatar).scene : null),
    [avatar],
  )
  const trainScene = useMemo(() => useGLTF('/assets/map/train.glb').scene, [])

  useEffect(() => {
    if (user?.avatarId) {
      setAvatar(CHARACTER_ASSETS[user.avatarId])
    }
  }, [user])

  useEffect(() => {
    if (!characterScene || !trainScene) return
    if (!user || !avatar) return

    setAvatar(CHARACTER_ASSETS[user?.avatarId])

    // 캐릭터 설정
    character.current = characterScene
    character.current.scale.set(0.005, 0.005, 0.005)
    scene.add(character.current)
    // 캐릭터가 타고다닐 기차 설정
    train.current = trainScene
    train.current.scale.set(3, 2, 2)
    scene.add(train.current)

    return () => {
      if (character && train && character.current && train.current) {
        characterScene.remove(character.current)
        trainScene.remove(train.current)
      }
    }
  }, [avatar])

  return { character, train }
}
// 빌딩 설정
const SetBuilding = ({
  setIsVisible,
  setSelectedScenario,
}: {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedScenario: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { user } = useUser()
  const { camera, gl } = useThree()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controls = useRef<any | null>(null)
  const { character, train } = useCharacter(user ? user : null)

  useFrame(() => {
    controls.current.rotateSpeed = 0.3
    controls.current.update()

    const azimuthalAngle = controls.current.getAzimuthalAngle()
    const positiveAzimuthalAngle =
      azimuthalAngle < 0 ? azimuthalAngle + 2 * Math.PI : azimuthalAngle

    if (character.current) {
      character.current.position.x = Math.sin(azimuthalAngle) * 11.4
      character.current.position.y = 0.2
      character.current.position.z = Math.cos(azimuthalAngle) * 11.4 + 0.03
      character.current.rotation.y = azimuthalAngle
    }
    if (train.current) {
      train.current.position.x = Math.sin(azimuthalAngle) * 11.4
      train.current.position.y = 0.2
      train.current.position.z = Math.cos(azimuthalAngle) * 11.4 + 0.03
      train.current.rotation.y = azimuthalAngle + Math.PI * 0.5
    }

    const hospitalCondition =
      positiveAzimuthalAngle >= Math.PI * (70 / 180) && // 병원
      positiveAzimuthalAngle <= Math.PI * (100 / 180)
    const schoolCondition =
      positiveAzimuthalAngle >= Math.PI * (160 / 180) && // 학교
      positiveAzimuthalAngle <= Math.PI * (190 / 180)
    const policeOfficerCondition =
      positiveAzimuthalAngle >= Math.PI * (250 / 180) && // 경찰서
      positiveAzimuthalAngle <= Math.PI * (280 / 180)
    const fireStationCondition =
      (positiveAzimuthalAngle >= Math.PI * (340 / 180) && // 소방서
        positiveAzimuthalAngle <= Math.PI * (360 / 180)) ||
      (positiveAzimuthalAngle >= Math.PI * (0 / 180) &&
        positiveAzimuthalAngle <= Math.PI * (10 / 180))

    if (
      hospitalCondition ||
      schoolCondition ||
      policeOfficerCondition ||
      fireStationCondition
    ) {
      if (hospitalCondition) {
        setSelectedScenario(1)
      } else if (schoolCondition) {
        setSelectedScenario(2)
      } else if (policeOfficerCondition) {
        setSelectedScenario(3)
      } else if (fireStationCondition) {
        setSelectedScenario(0)
      }
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  })

  return (
    <OrbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      minPolarAngle={Math.PI / 2.3}
      maxPolarAngle={Math.PI / 2.3}
      minDistance={17}
      maxDistance={23}
    />
  )
}

export default function Map({ scenarios }: { scenarios: Scenario[] }) {
  const { scene: mapScene } = useGLTF('/assets/map/map.glb')
  const [selectedScenario, setSelectedScenario] = useState(0)
  const [isVisible, setIsVisible] = useState(false) // 시나리오 모달 visible 여부

  return (
    <div className="w-full h-full bg-[#c9f1ff]">
      {isVisible ? (
        <ScenarioPopup
          imgUrl={scenarios[selectedScenario]?.imgUrl}
          name={scenarios[selectedScenario]?.name}
          description={scenarios[selectedScenario]?.description}
          id={scenarios[selectedScenario]?.id}
        />
      ) : null}

      <Canvas camera={{ position: [2, 2, 2], fov: 70 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={2} color="#ffffff" />
          <directionalLight
            castShadow
            position={[0, 30, 0]}
            intensity={4}
            color="#ffffff"
          />
          {/* 맵  */}
          <primitive
            object={mapScene}
            dispose={null}
            scale={[1.75, 1.75, 1.75]}
          />
          {/* 캐릭터 & 시나리오 빌딩 */}
          <SetBuilding
            setIsVisible={setIsVisible}
            setSelectedScenario={setSelectedScenario}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

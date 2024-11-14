import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function SmokeModel({
  position = [0, 0, 0],
}: {
  position: number[]
}) {
  const smokeTexture: any = useTexture('/images/texture/smoke.png')

  const smokeParticles = useMemo(() => {
    const particles = []
    for (let i = 0; i < 90; i++) {
      particles.push({
        position: new THREE.Vector3(
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 2300,
        ),
        rotationZ: Math.random() * Math.PI * 2,
      })
    }
    return particles
  }, [])

  return (
    <group position={[position[0] * 500, position[1] * 500, position[2] * 500]}>
      {smokeParticles.map((particle, index) => (
        <mesh
          key={index}
          position={particle.position}
          rotation={[0, 0, particle.rotationZ]}
          scale={[3, 3, 3]}
        >
          <planeGeometry args={[300, 300]} />
          <meshLambertMaterial
            map={smokeTexture}
            emissive={new THREE.Color(0x222222)}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  )
}

import ModelLoader from '@/app/scenario/[id]/situation/components/ModelLoader'

interface FireModelsProps {
  scale?: [number, number, number]
}

export default function FireModel({ scale = [5, 5, 5] }: FireModelsProps) {
  return (
    <>
      <ModelLoader
        path="/assets/scenario/fire2.glb"
        position={[2, 1, 0]}
        scale={scale}
      />
      <ModelLoader
        path="/assets/scenario/fire2.glb"
        position={[4, 1, 0]}
        scale={scale}
      />
      <ModelLoader
        path="/assets/scenario/fire2.glb"
        position={[3, 1, 0]}
        scale={scale}
      />
    </>
  )
}

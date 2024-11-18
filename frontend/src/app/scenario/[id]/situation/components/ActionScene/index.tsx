export default function ActionScene({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 3, 3]} intensity={2} color="#ffffff" />
      <pointLight
        position={[3, 2, 1]}
        intensity={2}
        color="#ffffff"
        distance={8}
      />
      <spotLight
        position={[2, 3, 2]}
        angle={0.6}
        penumbra={0.3}
        intensity={2.5}
        color="#ffffff"
      />
      {children}
    </group>
  )
}

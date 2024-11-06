import Image from 'next/image'

export default function Chalkboard({ drawingImage }: { drawingImage: string }) {
  return (
    <>
      <Image
        src="/images/blackboard.png"
        alt="blackboard"
        width={898}
        height={488}
        className="max-w-full h-auto"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={drawingImage}
          alt="drawing"
          width={135}
          height={131}
          className="h-3/5 w-auto object-contain"
        />
      </div>
    </>
  )
}

import Image from 'next/image'

export default function SignButton({
  onClick,
  content,
}: {
  onClick: () => void
  content: string
}) {
  return (
    <button onClick={onClick} className="relative w-[190px] h-[100px]">
      <Image
        src="/images/wooden_arrow_sign.png"
        alt="나무 버튼"
        width={200}
        height={100}
        className="rounded-lg object-cover"
      />
      <span className="absolute top-[38px] left-[90px] transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold">
        {content}
      </span>
    </button>
  )
}

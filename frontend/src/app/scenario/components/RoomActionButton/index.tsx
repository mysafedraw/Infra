import Image from 'next/image'

export default function RoomActionButton({
  bgColor,
  label,
  onClick,
  children,
}: {
  bgColor: string
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      className={`${bgColor} group flex justify-center items-center flex-col w-[26rem] h-96 rounded-2xl border-white border-[5px] gap-10 shadow-button-inactive relative hover:scale-105 hover:shadow-button-active transition-transform duration-200 ease-in-out`}
      onClick={onClick}
    >
      <div className="flex items-end justify-center w-60 bg-white h-44 rounded-lg group-hover:shadow-md pb-3 -space-x-5">
        {children}
      </div>
      <span className="text-white text-stroke text-6xl">{label}</span>
    </button>
  )
}

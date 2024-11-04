export default function RoomActionButton({
  bgColor,
  label,
}: {
  bgColor: string
  label: string
}) {
  return (
    <button
      className={`${bgColor} group flex justify-center items-center flex-col w-[26rem] h-96 rounded-2xl border-white border-[5px] gap-10 shadow-button-inactive relative hover:scale-105 hover:shadow-button-active transition-transform duration-200 ease-in-out`}
    >
      <div className="flex flex-col w-60 bg-white h-44 rounded-lg group-hover:shadow-md">
        <span>캐릭터</span>
      </div>
      <span className="text-white text-stroke text-6xl">{label}</span>
    </button>
  )
}

import Image from 'next/image'
import Link from 'next/link'

export default function ScenarioPopup({
  imgUrl,
  name,
  description,
  id,
}: {
  imgUrl: string
  name: string
  description: string
  id: number
}) {
  return (
    <div className="flex flex-col absolute bg-[#ffee34] border-[4px] border-[#fff38b] top-10 left-1/2 -translate-x-1/2 z-10 shadow-custom-inset px-7 pt-7 pb-3 gap-4 rounded-lg text-white w-full max-w-[42rem] shadow-button-active ">
      <div className="flex gap-8 w-full items-start">
        <Image
          src={imgUrl}
          width={160}
          height={128}
          alt="scenario-map"
          className="object-cover w-40 h-32 rounded-md"
        />
        <div className="flex flex-col gap-3">
          <h1 className="text-stroke text-4xl">{name}</h1>
          <div className="text-text text-2xl">
            <p>{description}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Link
          href={{
            pathname: `/scenario/${id}`,
            query: { name },
          }}
        >
          <button className="flex gap-1 text-primary-950">
            <p>시나리오 참여하기</p>
            <span>→</span>
          </button>
        </Link>
      </div>
    </div>
  )
}

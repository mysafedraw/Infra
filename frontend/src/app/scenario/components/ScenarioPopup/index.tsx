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
  const unavailableMap = ['병원 시나리오', '학교 시나리오', '범죄 시나리오']

  return (
    <>
      <div className="flex flex-col absolute bg-[#ffee34] outline-[4px] outline-[#fff38b] top-10 left-1/2 -translate-x-1/2 z-10 shadow-custom-inset  gap-4 rounded-lg text-white w-full max-w-[42rem] shadow-button-active select-none overflow-hidden">
        <div className="relative w-full h-full px-7 pt-7 pb-3">
          {unavailableMap.includes(name) ? (
            <div
              style={{ backgroundColor: 'rgba(145, 176, 93, 0.95)' }}
              className="flex flex-col justify-center items-center absolute z-10 w-full h-full left-0 top-0 gap-2"
            >
              <Image
                src="/images/character/bunny.png"
                height={100}
                width={50}
                alt="character"
              />
              <p className="text-xl text-white">
                지금은 이용할 수 없는 시나리오야. 조금만 더 기다려줘💛
              </p>
            </div>
          ) : null}
          <div className="flex gap-8 w-full items-start">
            <Image
              src={imgUrl}
              width={160}
              height={128}
              alt="scenario-map"
              className="object-cover w-40 h-32 rounded-md"
              draggable={false}
            />
            <div className="flex flex-col gap-3">
              <h1 className="text-stroke text-4xl" draggable={false}>
                {name}
              </h1>
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
      </div>
    </>
  )
}

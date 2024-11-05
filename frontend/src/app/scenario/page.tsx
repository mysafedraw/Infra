import Link from 'next/link'

export default function Scenario() {
  return (
    <div>
      <p>시나리오 메인페이지</p>
      <Link href="/scenario/1">
        <button>시나리오 1번으로 이동</button>
      </Link>
    </div>
  )
}

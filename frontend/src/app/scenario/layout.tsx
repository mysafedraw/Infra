import { ReactNode } from 'react'

export default function ScenarioLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <>
      {modal}
      <main>{children}</main>
    </>
  )
}

import EnterInput from './components/EnterInput'

export default function Enter() {
  return (
    <div className="p-20 w-screen h-screen bg-secondary-500 flex flex-col">
      <h1 className="text-5xl text-white font-outline-2 text-center">
        QR 코드를 스캔하거나 방 코드를 입력해주세요
      </h1>
      <div className="flex h-full justify-center flex-col items-center">
        {/* QR 코드 사진 추가하기 */}
        <EnterInput />
      </div>
    </div>
  )
}

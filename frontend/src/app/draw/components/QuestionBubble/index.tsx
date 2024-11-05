export default function QuestionBubble({ content }: { content: string }) {
  return (
    <div className="relative inline-block py-4 px-10 bg-white border-4 border-primary-600 rounded-3xl shadow-md z-50">
      <p className="text-3xl text-gray-800">{content}</p>
      <div className="absolute left-1/2 transform -translate-x-1/2 -z-20 bottom-[-11px] w-4 h-4 bg-white border-l-4 border-b-4 border-primary-600 -rotate-45"></div>
    </div>
  )
}

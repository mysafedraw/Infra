'use client'

export default function QuestionBoard({ content }: { content: string }) {
  return (
    <div className="flex py-4 px-2 bg-primary-600 border-4 border-primary-700 w-full rounded-md justify-center">
      <p className="whitespace-pre-wrap leading-9 text-center text-text text-4xl select-none">
        {content}
      </p>
    </div>
  )
}

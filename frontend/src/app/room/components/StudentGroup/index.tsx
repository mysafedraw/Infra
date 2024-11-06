import { useState } from 'react'
import Image from 'next/image'
import { Student } from '@/app/room/types/studentType'
import RightArrowIcon from '/public/icons/rounded-right-arrow.svg'
import LeftArrowIcon from '/public/icons/rounded-left-arrow.svg'

export default function StudentGroup({ students }: { students: Student[] }) {
  const STUDENTS_PER_PAGE = 6

  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(students.length / STUDENTS_PER_PAGE)
  const startIndex = currentPage * STUDENTS_PER_PAGE

  const gridSlots = Array(STUDENTS_PER_PAGE)
    .fill(null)
    .map((_, index) => {
      const studentIndex = startIndex + index
      return studentIndex < students.length ? students[studentIndex] : null
    })

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  return (
    <div className="bg-primary-500 px-4 py-4 rounded-lg shadow-md">
      <div className="grid grid-cols-3 gap-4">
        {gridSlots.map((student, index) =>
          student ? (
            <div
              key={student.userId}
              className={`
              flex flex-col items-center p-4 rounded-lg cursor-pointer shadow-md h-44 text-text
              ${student.userId === 'player001' ? 'bg-primary-600' : 'bg-white'}
            `}
            >
              <p className="text-xl font-bold text-text select-none">
                {student.nickname}
              </p>
              <div className="relative w-40 h-40 mt-auto overflow-hidden">
                <Image
                  src="/images/rabbit.png"
                  alt={student.nickname}
                  fill
                  className="object-contain scale-125 translate-y-5"
                />
              </div>
            </div>
          ) : (
            <div
              key={`empty-${index}`}
              className="bg-gray-300 opacity-30 rounded-lg p-4 h-44"
            />
          ),
        )}
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="transition-colors"
        >
          <LeftArrowIcon
            className={`fill-current ${
              currentPage === 0 ? 'text-gray-300' : 'text-primary-50'
            }`}
          />
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="transition-colors"
        >
          <RightArrowIcon
            className={`fill-current ${
              currentPage === totalPages - 1
                ? 'text-gray-300'
                : 'text-primary-50'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

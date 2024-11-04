'use client'

import { useState } from 'react'

interface VolumeSliderProps {
  label: string
}

export default function VolumeSlider({ label }: VolumeSliderProps) {
  const [value, setValue] = useState<number>(50)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(Number(e.target.value))

  return (
    <div className="flex items-center mb-3">
      <label className="mr-4 text-3xl">{label}</label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="grow appearance-none h-3 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
        style={{
          background: `linear-gradient(to right, #C2EA7C ${value}%, #A9A9A9 ${value}%)`,
        }}
      />
    </div>
  )
}

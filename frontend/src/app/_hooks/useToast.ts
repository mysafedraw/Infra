import { useState, useCallback } from 'react'

interface ToastState {
  message: string
  isVisible: boolean
  duration: number
  imageSrc?: string
  altText?: string
}

export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    isVisible: false,
    duration: duration,
  })

  const showToast = useCallback(
    (
      message: string,
      options?: { duration?: number; imageSrc?: string; altText?: string },
    ) => {
      setToast({
        message,
        isVisible: true,
        duration: options?.duration || duration,
        imageSrc: options?.imageSrc,
        altText: options?.altText,
      })

      setTimeout(() => {
        setToast((prev) => ({ ...prev, isVisible: false }))
      }, options?.duration || duration)
    },
    [duration],
  )

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  return { toast, showToast, hideToast }
}

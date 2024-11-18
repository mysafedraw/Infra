import { useState, useCallback } from 'react'

interface ToastState {
  message: string
  isVisible: boolean
  duration: number
  imageSrc?: string
  altText?: string
  isBackGround?: boolean
}

export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    isVisible: false,
    duration: duration,
    isBackGround: true,
  })

  const showToast = useCallback(
    (
      message: string,
      options?: {
        duration?: number
        imageSrc?: string
        altText?: string
        isBackGround?: boolean
      },
    ) => {
      setToast({
        message,
        isVisible: true,
        duration: options?.duration || duration,
        imageSrc: options?.imageSrc,
        altText: options?.altText,
        isBackGround: options?.isBackGround,
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

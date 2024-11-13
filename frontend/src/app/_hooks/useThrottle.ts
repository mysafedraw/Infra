import { useCallback, useRef } from 'react'

export const useThrottle = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) => {
  const lastCall = useRef(0)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastCall.current >= delay) {
        callback(...args)
        lastCall.current = now
      }
    },
    [callback, delay],
  )
}

'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

// 좌표
interface Point {
  x: number
  y: number
}

type EventType = React.MouseEvent | React.Touch | MouseEvent | Touch

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [scale, setScale] = useState<number>(1)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = containerRef.current
      if (!container) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      const dpr = window.devicePixelRatio || 1
      setScale(dpr)

      canvas.width = containerWidth * dpr
      canvas.height = containerHeight * dpr

      canvas.style.width = `${containerWidth}px`
      canvas.style.height = `${containerHeight}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.scale(dpr, dpr)

      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      setContext(ctx)
    }

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // 마우스/터치 이벤트 좌표 -> 캔버스 좌표로 변환
  const getCoordinates = useCallback((event: EventType): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 }

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    }
  }, [])

  // 그리기 시작
  const startDrawing = useCallback(
    (point: Point) => {
      if (!context) return

      setIsDrawing(true)
      context.beginPath()
      context.moveTo(point.x / scale, point.y / scale)
    },
    [context, scale],
  )

  // 그리기 진행
  const draw = useCallback(
    (point: Point) => {
      if (!context || !isDrawing) return

      context.lineTo(point.x / scale, point.y / scale)
      context.stroke()
    },
    [context, scale, isDrawing],
  )

  // 그리기 종료
  const stopDrawing = useCallback(() => {
    if (!context) return
    setIsDrawing(false)
    context.closePath()
  }, [context])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const point = getCoordinates(e)
      startDrawing(point)
    },
    [getCoordinates, startDrawing],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return
      const point = getCoordinates(e)
      draw(point)
    },
    [getCoordinates, draw, isDrawing],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      const point = getCoordinates(touch)
      startDrawing(point)
    },
    [getCoordinates, startDrawing],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      const point = getCoordinates(touch)
      draw(point)
    },
    [getCoordinates, draw],
  )

  // 캔버스 초기화 (모두 지우기)
  const clearCanvas = useCallback(() => {
    if (!context || !canvasRef.current) return
    const canvas = canvasRef.current
    context.clearRect(0, 0, canvas.width / scale, canvas.height / scale)
  }, [context, scale])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const preventDefaultTouch = (e: TouchEvent) => {
      e.preventDefault()
    }

    canvas.addEventListener('touchstart', preventDefaultTouch, {
      passive: false,
    })
    canvas.addEventListener('touchmove', preventDefaultTouch, {
      passive: false,
    })
    canvas.addEventListener('touchend', preventDefaultTouch, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', preventDefaultTouch)
      canvas.removeEventListener('touchmove', preventDefaultTouch)
      canvas.removeEventListener('touchend', preventDefaultTouch)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-md relative h-fit"
      style={{
        touchAction: 'none',
        height: `calc(100vh - 320px)`,
      }}
    >
      {/* 전체 지우개(임시 아이콘) */}
      <div className="absolute right-4 top-8 flex gap-2 z-10">
        <button
          onClick={clearCanvas}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          🗑️
        </button>
      </div>

      {/* 캔버스 */}
      <canvas
        ref={canvasRef}
        className="touch-none cursor-crosshair p-1"
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      />
    </div>
  )
}

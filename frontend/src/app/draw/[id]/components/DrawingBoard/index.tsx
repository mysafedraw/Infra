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
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null) // 캔버스 컨텍스트 상태
  const [scale, setScale] = useState<number>(1) // 디바이스 픽셀 비율에 따른 스케일 값

  // 캔버스 초기화 및 리사이즈 처리
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      // 컨테이너의 실제 크기 가져오기
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      // 디바이스 픽셀 비율 계산
      const dpr = window.devicePixelRatio || 1
      setScale(dpr)

      // 실제 캔버스 크기 설정
      canvas.width = containerWidth * dpr
      canvas.height = containerHeight * dpr

      // 화면에 표시될 크기 설정
      canvas.style.width = `${containerWidth}px`
      canvas.style.height = `${containerHeight}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // 컨텍스트 스케일 조정
      ctx.scale(dpr, dpr)

      // 기본 그리기 설정
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      setContext(ctx)
    }

    // 초기 크기 설정
    resizeCanvas()

    // 윈도우 크기 변경 시 캔버스 크기도 조정
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

    // 실제 캔버스 크기와 표시 크기의 비율을 고려하여 좌표 계산
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    }
  }, [])

  // 그리기 시작
  const startDrawing = useCallback(
    (point: Point) => {
      if (!context) return

      context.beginPath()
      context.moveTo(point.x / scale, point.y / scale)
    },
    [context, scale],
  )

  // 그리기 진행
  const draw = useCallback(
    (point: Point) => {
      if (!context) return

      context.lineTo(point.x / scale, point.y / scale)
      context.stroke()
    },
    [context, scale],
  )

  // 그리기 종료
  const stopDrawing = useCallback(() => {
    if (!context) return
    context.closePath()
  }, [context])

  // 마우스 이벤트 핸들러
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
      const point = getCoordinates(e)
      draw(point)
    },
    [getCoordinates, draw],
  )

  // 터치 이벤트 핸들러
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

  // 모바일에서 스크롤 및 기본 터치 동작 방지
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const preventDefaultTouch = (e: TouchEvent) => {
      e.preventDefault()
    }

    // 터치 이벤트 리스너 등록
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
      className="bg-white rounded-md relative"
      style={{ touchAction: 'none' }}
    >
      {/* 전체 지우개(임시 아이콘) */}
      <div className="absolute right-4 top-4 flex gap-2 z-10">
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

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ARControllerProps {
  children: React.ReactNode
  markerUrl?: string
  cameraParamsUrl?: string
  onMarkerFound?: () => void
  onMarkerLost?: () => void
}

// AR 컨텍스트를 관리하는 컴포넌트
export default function ARController({
  children,
  markerUrl = '/datas/patt.hiro',
  cameraParamsUrl = '/datas/camera_para.dat',
  onMarkerFound,
  onMarkerLost,
}: ARControllerProps) {
  const { camera, gl } = useThree()
  const arContext = useRef<any>(null)
  const arSource = useRef<any>(null)
  const markerRoot = useRef(new THREE.Group())
  const markerControls = useRef<any>(null)

  useEffect(() => {
    let isMarkerVisible = false

    const initAR = async () => {
      const AR = await import('@ar-js-org/ar.js/three.js/build/ar-threex.js')
      const THREEx: any = AR.default || AR

      // AR 소스 설정
      arSource.current = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
        sourceWidth: 640,
        sourceHeight: 480,
        displayWidth: window.innerWidth,
        displayHeight: window.innerHeight,
        constraints: {
          audio: false,
          video: {
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 60 },
          },
        },
      })

      // AR 컨텍스트 설정
      arContext.current = new THREEx.ArToolkitContext({
        cameraParamsUrl,
        detectionMode: 'mono',
        maxDetectionRate: 60,
        canvasWidth: 640,
        canvasHeight: 480,
        imageSmoothingEnabled: false,
        threshold: 100,
      })

      // 컨텍스트 초기화
      await new Promise<void>((resolve) => {
        arContext.current.init(() => {
          camera.projectionMatrix.copy(arContext.current.getProjectionMatrix())
          camera.updateProjectionMatrix()
          resolve()
        })
      })

      // 소스 초기화
      await new Promise<void>((resolve) => {
        arSource.current.init(() => {
          onResize()
          resolve()
        })
      })

      // 마커 컨트롤 설정
      markerControls.current = new THREEx.ArMarkerControls(
        arContext.current,
        markerRoot.current,
        {
          type: 'pattern',
          patternUrl: markerUrl,
          smooth: true,
          smoothCount: 5,
          smoothTolerance: 0.01,
          smoothThreshold: 2,
        },
      )

      // 마커 이벤트 처리
      if (onMarkerFound || onMarkerLost) {
        markerRoot.current.visible = false
        markerControls.current.addEventListener('markerFound', () => {
          if (!isMarkerVisible) {
            isMarkerVisible = true
            markerRoot.current.visible = true
            onMarkerFound?.()
          }
        })
        markerControls.current.addEventListener('markerLost', () => {
          if (isMarkerVisible) {
            isMarkerVisible = false
            markerRoot.current.visible = false
            onMarkerLost?.()
          }
        })
      }
    }

    const onResize = () => {
      if (arSource.current) {
        arSource.current.onResizeElement()
        arSource.current.copyElementSizeTo(gl.domElement)
        if (arContext.current?.arController !== null) {
          arSource.current.copyElementSizeTo(
            arContext.current.arController.canvas,
          )
        }
      }
    }

    initAR()

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [camera, gl, markerUrl, cameraParamsUrl, onMarkerFound, onMarkerLost])

  // AR 업데이트 프레임
  useFrame(() => {
    if (arSource.current?.ready && arContext.current) {
      arContext.current.update(arSource.current.domElement)
    }
  })

  return <primitive object={markerRoot.current}>{children}</primitive>
}

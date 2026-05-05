import type React from "react"
import { useRef, useCallback } from "react"

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  minSwipeDistance?: number
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, minSwipeDistance = 50 }: SwipeGestureOptions) {
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const endX = useRef<number>(0)
  const endY = useRef<number>(0)
  const isDragging = useRef<boolean>(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.targetTouches[0].clientX
    startY.current = e.targetTouches[0].clientY
    isDragging.current = true
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    endX.current = e.targetTouches[0].clientX
    endY.current = e.targetTouches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return

    const distanceX = startX.current - endX.current
    const distanceY = startY.current - endY.current
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    }

    isDragging.current = false
    startX.current = 0
    startY.current = 0
    endX.current = 0
    endY.current = 0
  }, [onSwipeLeft, onSwipeRight, minSwipeDistance])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startX.current = e.clientX
    startY.current = e.clientY
    isDragging.current = true
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    endX.current = e.clientX
    endY.current = e.clientY
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return

    const distanceX = startX.current - endX.current
    const distanceY = startY.current - endY.current
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    }

    // Reset values
    isDragging.current = false
    startX.current = 0
    startY.current = 0
    endX.current = 0
    endY.current = 0
  }, [onSwipeLeft, onSwipeRight, minSwipeDistance])

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false
    startX.current = 0
    startY.current = 0
    endX.current = 0
    endY.current = 0
  }, [])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  }
}


// import type React from "react"

// import { useRef, useCallback } from "react"

// interface SwipeGestureOptions {
//   onSwipeLeft?: () => void
//   onSwipeRight?: () => void
//   minSwipeDistance?: number
// }

// export function useSwipeGesture({ onSwipeLeft, onSwipeRight, minSwipeDistance = 50 }: SwipeGestureOptions) {
//   const touchStartX = useRef<number>(0)
//   const touchStartY = useRef<number>(0)
//   const touchEndX = useRef<number>(0)
//   const touchEndY = useRef<number>(0)

//   const handleTouchStart = useCallback((e: React.TouchEvent) => {
//     touchStartX.current = e.targetTouches[0].clientX
//     touchStartY.current = e.targetTouches[0].clientY
//   }, [])

//   const handleTouchMove = useCallback((e: React.TouchEvent) => {
//     touchEndX.current = e.targetTouches[0].clientX
//     touchEndY.current = e.targetTouches[0].clientY
//   }, [])

//   const handleTouchEnd = useCallback(() => {
//     if (!touchStartX.current || !touchEndX.current) return

//     const distanceX = touchStartX.current - touchEndX.current
//     const distanceY = touchStartY.current - touchEndY.current
//     const isLeftSwipe = distanceX > minSwipeDistance
//     const isRightSwipe = distanceX < -minSwipeDistance

//     if (Math.abs(distanceX) > Math.abs(distanceY)) {
//       if (isLeftSwipe && onSwipeLeft) {
//         onSwipeLeft()
//       }
//       if (isRightSwipe && onSwipeRight) {
//         onSwipeRight()
//       }
//     }

//     // Reset values
//     touchStartX.current = 0
//     touchStartY.current = 0
//     touchEndX.current = 0
//     touchEndY.current = 0
//   }, [onSwipeLeft, onSwipeRight, minSwipeDistance])

//   return {
//     onTouchStart: handleTouchStart,
//     onTouchMove: handleTouchMove,
//     onTouchEnd: handleTouchEnd,
//   }
// }

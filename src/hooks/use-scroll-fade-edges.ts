import { useLayoutEffect, useState, type RefObject } from 'react'

type ScrollFadeEdges = {
  left: boolean
  right: boolean
}

export function useScrollFadeEdges(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  const [edges, setEdges] = useState<ScrollFadeEdges>({
    left: false,
    right: false,
  })

  useLayoutEffect(() => {
    if (!enabled) {
      setEdges({ left: false, right: false })
      return
    }

    const element = ref.current

    if (!element) {
      return
    }

    const updateEdges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = element

      setEdges({
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth < scrollWidth - 1,
      })
    }

    updateEdges()

    const resizeObserver = new ResizeObserver(updateEdges)
    resizeObserver.observe(element)
    element.addEventListener('scroll', updateEdges, { passive: true })

    return () => {
      resizeObserver.disconnect()
      element.removeEventListener('scroll', updateEdges)
    }
  }, [ref, enabled])

  return edges
}

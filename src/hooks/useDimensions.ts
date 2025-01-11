import React, { useEffect, useState } from "react"

export default function useDimensions(containerRef: React.RefObject<HTMLElement>) {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const currentRef = containerRef.current;

    function getDimensions() {
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0
      };
    }

    const resizeObserver = new ResizeObserver((entries) => { // | JS API that allows you to observe changes in the size of an element's content or border box
      const entry = entries[0]
      if (entry) {
        setDimensions(getDimensions())
      }
    })

    if (currentRef) {
      resizeObserver.observe(currentRef)
      setDimensions(getDimensions())
    }

    // ? Unobserve the element when the component is unmounted - Cleanup
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef) // ? Stop observing the element
      }
      resizeObserver.disconnect()
    }
  }, [containerRef])

  return dimensions
}
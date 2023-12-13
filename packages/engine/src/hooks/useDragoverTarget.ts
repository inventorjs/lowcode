import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'
import { useCanvasState } from './useCanvasState'

export function useDragoverTarget() {
  const { engine } = useEngine()
  const dragoverTarget = useSelector(() => engine.document?.dragoverTarget)
  const { canvasState } = useCanvasState()
  const [domRect, setDomRect] = useState<DOMRect | null>(null)
  useEffect(() => {
    if (canvasState && dragoverTarget) {
      const nodeDom = engine?.document?.getNodeDomById(dragoverTarget?.nodeId)
      if (nodeDom) {
        setDomRect(nodeDom.getBoundingClientRect())
      }
    }
  }, [engine, dragoverTarget, canvasState])

  return { dragoverTarget, domRect }
}

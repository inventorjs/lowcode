import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'
import { useEffect } from 'react'
import { useCanvasState } from './useCanvasState'

export function useHoverNode() {
  const [domRect, setDomRect] = useState<DOMRect | null>(null)
  const { engine } = useEngine()
  const { canvasState } = useCanvasState()
  const hoverNodeId = useSelector(() => engine.document?.hoverNodeId)
  const hoverNode = useSelector(() =>
    engine?.document?.getNodeById(hoverNodeId as string),
  )
  useEffect(() => {
    if (hoverNode && canvasState) {
      const nodeDom = engine?.document?.getNodeDomById(hoverNode?.id)
      setDomRect(nodeDom?.getBoundingClientRect() as DOMRect)
    } else {
      setDomRect(null)
    }
  }, [engine?.document, hoverNode, canvasState])

  const setHoverNodeId = (nodeId: string | null) =>
    engine?.document?.setHoverNodeId(nodeId)

  return { hoverNode, domRect, setHoverNodeId }
}

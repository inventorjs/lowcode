import { useEffect, useState } from 'react';
import { useHoverNode } from './useHoverNode';
import { useEngine } from './useEngine';
import { useCanvasState } from './useCanvasState';

export function useHoverNodeDomRect() {
  const { engine } = useEngine()
  const { hoverNode } = useHoverNode()
  const { canvasState } = useCanvasState()
  const [hoverNodeDomRect, setHoverNodeDomRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (hoverNode && canvasState) {
      const nodeDom = engine?.document?.getNodeDomById(hoverNode.id)
      setHoverNodeDomRect(nodeDom?.getBoundingClientRect() as DOMRect ?? null)
    } else {
      setHoverNodeDomRect(null)
    }
  }, [hoverNode, canvasState])

  return { hoverNodeDomRect }
}

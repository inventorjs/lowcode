import { useEffect, useState } from 'react';
import { useActiveNode } from './useActiveNode';
import { useEngine } from './useEngine';
import { useCanvasState } from './useCanvasState';

export function useActiveNodeDomRect() {
  const { engine } = useEngine()
  const { activeNode } = useActiveNode()
  const [activeNodeDomRect, setActiveNodeDomRect] = useState<DOMRect | null>(null)
  const { canvasState } = useCanvasState()

  useEffect(() => {
    if (activeNode && canvasState) {
      const nodeDom = engine?.document?.getNodeDomById(activeNode.id)
      setActiveNodeDomRect(nodeDom?.getBoundingClientRect() as DOMRect ?? null)
    } else {
      setActiveNodeDomRect(null)
    }
  }, [activeNode, canvasState])

  return { activeNodeDomRect }
}

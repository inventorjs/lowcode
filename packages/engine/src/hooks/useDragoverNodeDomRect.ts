import { useEffect, useState } from 'react';
import { useDragoverNode } from './useDragoverNode';
import { useEngine } from './useEngine';

export function useDragoverNodeDomRect() {
  const { engine } = useEngine()
  const { dragoverNode } = useDragoverNode()
  const [dragoverNodeDomRect, setDragoverNodeDomRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (dragoverNode) {
      const nodeDom = engine?.document?.getNodeDomById(dragoverNode.id)
      setDragoverNodeDomRect(nodeDom?.getBoundingClientRect() as DOMRect ?? null)
    } else {
      setDragoverNodeDomRect(null)
    }
  }, [dragoverNode])

  return { dragoverNodeDomRect }
}

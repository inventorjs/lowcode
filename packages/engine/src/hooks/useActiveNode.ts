import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'
import { useCallback } from 'react'

export function useActiveNode() {
  const { engine } = useEngine()
  useSelector(() => engine.document!.activeNode!.toJson())

  const activeNode = engine.document?.activeNode

  const removeActiveNode = useCallback(() => {
    if (activeNode?.id) {
      activeNode.remove()
    }
  }, [activeNode])

  const setActiveNodeId = useCallback(
    (nodeId: string) => engine?.document?.setActiveNodeId(nodeId),
    [],
  )

  return { activeNode, removeActiveNode, setActiveNodeId }
}

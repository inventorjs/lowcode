import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'
import { useNodeById } from './useNodeById'

export function useDragoverNode() {
  const { engine } = useEngine()
  const dragoverTarget = useSelector(() => engine.document?.dragoverTarget)
  const { node } = useNodeById(dragoverTarget?.nodeId as string)

  return { dragoverNode: node }
}

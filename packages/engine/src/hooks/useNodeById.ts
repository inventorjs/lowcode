import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'

export function useNodeById(nodeId: string) {
  const { engine } = useEngine()
  useSelector(() => engine.document?.getNodeById(nodeId)?.toJson())
  const node = engine.document?.getNodeById(nodeId)

  return { node }
}

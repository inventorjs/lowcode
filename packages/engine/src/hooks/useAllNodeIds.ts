import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'

export function useAllNodeIds() {
  const { engine } = useEngine()
  const allNodeIds = useSelector(() => engine.document!.allNodeIds)
  return { allNodeIds }
}

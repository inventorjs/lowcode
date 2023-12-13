import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'

export function useAllNodes() {
  const { engine } = useEngine()
  const allNodes = useSelector(() => engine.document?.allNodes)

  return { allNodes }
}

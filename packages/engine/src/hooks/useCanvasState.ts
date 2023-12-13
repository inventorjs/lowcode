import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'

export function useCanvasState() {
  const { engine } = useEngine()
  const canvasState = useSelector(() => engine.document!.canvasState)

  return { canvasState }
}

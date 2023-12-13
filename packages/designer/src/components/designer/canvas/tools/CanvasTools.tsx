import { useCanvasState } from '@lowcode/engine'
import { ActiveTool } from './ActiveTool'
import { DragoverTool } from './DragoverTool'
import { HoverTool } from './HoverTool'

export function CanvasTools() {
  const { canvasState } = useCanvasState()
  if (!canvasState) return null

  return (
    <div
      id="iframeMask"
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <ActiveTool />
      <HoverTool />
      <DragoverTool />
    </div>
  )
}

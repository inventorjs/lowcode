import {
  useDragoverTarget,
  capitalize,
  useDragoverNodeDomRect,
} from '@lowcode/engine'

export function DragoverTool() {
  const { dragoverTarget } = useDragoverTarget()
  const { dragoverNodeDomRect } = useDragoverNodeDomRect()

  if (!dragoverTarget || !dragoverNodeDomRect) return null

  const { top, left, width, height } = dragoverNodeDomRect

  let borderStyle: Record<string, string> = {
    backgroundColor:
      dragoverTarget.acceptStatus === 'accept'
        ? 'rgba(0,121,242,0.3)'
        : 'rgba(255, 0, 0, 0.1)',
  }
  if (dragoverTarget.alignPosition !== 'in') {
    borderStyle = {
      [`border${capitalize(dragoverTarget.alignPosition)}`]: `3px solid ${
        dragoverTarget.acceptStatus === 'accept' ? '#1d4ed8' : 'red'
      }`,
    }
  }

  return (
    <div
      className="absolute"
      style={{
        ...borderStyle,
        top,
        left,
        width,
        height,
      }}
    />
  )
}

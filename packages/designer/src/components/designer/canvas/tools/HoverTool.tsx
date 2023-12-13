import { useHoverNode, useHoverNodeDomRect } from '@lowcode/engine'

export function HoverTool() {
  const { hoverNode } = useHoverNode()
  const { hoverNodeDomRect } = useHoverNodeDomRect()

  if (!hoverNodeDomRect || !hoverNode) return null

  return (
    <div
      className="absolute box-border pointer-events-none"
      style={{
        top: hoverNodeDomRect.top,
        left: hoverNodeDomRect.left,
        width: hoverNodeDomRect.width,
        height: hoverNodeDomRect.height,
        border: '1px dashed #197aff',
        color: 'rgba(0,121,242,0.8)',
        backgroundColor: 'rgba(0,121,242,0.05)',
      }}
    >
      <div className="absolute left-0 -top-5">
        {hoverNode.title}
      </div>
    </div>
  )
}

import {
  useLCResourceById,
  useMaterialResourceUsedNodesById,
} from '@lowcode/engine'

export function LCResource({ resourceId }: { resourceId: string }) {
  const { ref, resource } = useLCResourceById<HTMLDivElement>(resourceId)
  const { usedNodes } = useMaterialResourceUsedNodesById(resourceId)
  if (!resource) return null

  return (
    <div
      draggable={true}
      ref={ref}
      style={{
        border: '1px solid #e5e6e8',
        borderRadius: 6,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        width: 116,
        cursor: 'grab',
        marginTop: 8,
        marginLeft: 8,
        backgroundColor: usedNodes.length > 0 ? 'rgb(217 236 255)' : '',
      }}
    >
      {resource.title}
    </div>
  )
}

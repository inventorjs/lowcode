import {
  useRootNode,
  useLCNodeById,
  isJSSlot,
  useMaterialComponentByName,
  useEngine,
} from '@lowcode/engine'
import type { JSSlot, Props } from '@lowcode/types'

function parseProps(props: Props) {
  if (!props) return {}
  const realProps: Props = {}
  Object.entries(props).forEach(([key, val]) => {
    const slotVal = val as JSSlot
    if (isJSSlot(slotVal)) {
      realProps[key] =
        slotVal.enabled && slotVal.id ? (
          <ComponentRenderer nodeId={slotVal.id} />
        ) : null
    } else if (val && typeof val === 'object') {
      realProps[key] = parseProps(val as Props)
    } else {
      realProps[key] = val
    }
  })
  return realProps
}

function ComponentRenderer({ nodeId }: { nodeId: string }) {
  const { engine } = useEngine()
  const { ref, node } = useLCNodeById(nodeId)
  const { Component } = useMaterialComponentByName(
    node?.componentName as string,
  )
  if (!node || !Component || !!node.hidden) return null
  const designProps = {
    __lc_engine: engine,
  }
  const props = parseProps(node.props)

  if (!node.childIds.length) {
    return <Component {...props} {...designProps} ref={ref} />
  }
  return (
    <Component {...props} {...designProps} ref={ref}>
      {node.childIds.map((nodeId) => (
        <ComponentRenderer nodeId={nodeId} key={nodeId} />
      ))}
    </Component>
  )
}

export function Simulator() {
  const { rootNode } = useRootNode()

  if (!rootNode) return null

  return <ComponentRenderer nodeId={rootNode.id} />
}

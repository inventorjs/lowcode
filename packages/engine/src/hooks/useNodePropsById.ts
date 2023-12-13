import { useActiveNode } from './useActiveNode'
import { useEngine } from './useEngine'
import { useHoverNode } from './useHoverNode'
import { useNodeById } from './useNodeById'
import { useRootNode } from './useRootNode'

export function useNodePropsById(nodeId: string) {
  const { engine } = useEngine()
  const { node } = useNodeById(nodeId)
  const { rootNode } = useRootNode()
  const { setActiveNodeId } = useActiveNode()
  const { hoverNode, setHoverNodeId } = useHoverNode()

  if (!node) return {}
  const schema = engine.materials.getPropsSchemaByName(node?.componentName)

  const updateNodeProps = (val: Record<string, unknown>) => {
    node.updateProps(val)
    if (typeof val.__designMode !== 'undefined') {
      setActiveNodeId(rootNode?.id as string)
      if (node.id === hoverNode?.id) {
        setHoverNodeId(null)
      }
    }
  }

  return { schema, props: node.props, updateNodeProps }
}

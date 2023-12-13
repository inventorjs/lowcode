import { useAllNodes } from './useAllNodes';
import { useEngine } from './useEngine';

export function useModalNodes() {
  const { engine } = useEngine()
  const { allNodes } = useAllNodes()

  const modalNodes = allNodes?.filter(( node ) => {
    const meta = engine.materials.getMetaByName(node.componentName)
    return meta && meta.isModal
  })

  return { modalNodes }
}

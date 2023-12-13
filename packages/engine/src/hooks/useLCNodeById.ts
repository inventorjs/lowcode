/**
 * 拖拽节点
 */
import { LC_TARGET } from '../common/constants'
import { useEngine } from './useEngine'
import { useMaterialBehaviorByName } from './useMaterialBehaviorByName'
import { useNodeById } from './useNodeById'

export function useLCNodeById(nodeId: string) {
  const { engine } = useEngine()
  const { node } = useNodeById(nodeId)
  const { behavior } = useMaterialBehaviorByName(node?.componentName as string)

  const handleRef = (refDom: HTMLElement | Record<string, HTMLElement>) => {
    if (refDom) {
      let dom: HTMLElement | undefined
      if (refDom instanceof HTMLElement) {
        dom = refDom
      } else {
        dom = Object.values(refDom ?? {}).find(
          (v) => v instanceof HTMLElement,
        ) 
      }
      if (dom) {
        dom[LC_TARGET] = {
          id: nodeId,
          type: 'node',
        }
        engine.document?.mountNodeById(nodeId, dom)
        if (behavior?.canMove()) {
          dom.setAttribute('draggable', 'true')
        }
      }
    } else {
      engine.document?.unmountNodeById(nodeId)
    }
  }

  return { node, ref: handleRef }
}

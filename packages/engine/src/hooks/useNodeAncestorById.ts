import { useNodeById } from './useNodeById'

export function useNodeAncestorById(nodeId: string) {
  const { node } = useNodeById(nodeId)
  return { nodeAncestor: node?.ancestorNodes ?? [] }
}

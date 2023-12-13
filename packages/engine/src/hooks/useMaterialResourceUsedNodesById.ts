import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'
import { useMaterialResourceById } from './useMaterialResourceById'

export function useMaterialResourceUsedNodesById(resourceId: string) {
  const { engine } = useEngine()
  const { resource } = useMaterialResourceById(resourceId)
  const allNodesIds = useSelector(() => engine.document?.allNodeIds)
  const allNodes = engine.document?.allNodes

  const usedNodes = useMemo(
    () =>
      allNodes?.filter(
        (node) =>
          allNodesIds &&
          allNodesIds?.length > 0 &&
          ((resource?.schema.resourceName &&
            resource.schema.resourceName === node.resourceName) ||
            (!resource?.schema.resourceName &&
              resource?.schema.componentName === node.componentName)),
      ) ?? [],
    [allNodes, resource, allNodesIds],
  )

  return { usedNodes }
}

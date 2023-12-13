import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'
import { ResourceEntity } from '@lowcode/types'

export function useMaterialResources() {
  const { engine } = useEngine()
  const resources = useSelector(() => engine.materials.resources)
  const assetsData = useSelector(() => engine.materials.assetsData)

  const categoryResources = useMemo(
    () =>
      assetsData?.sort.categoryList
        .map((category) => ({
          name: category.name,
          resources: category.components
            .map((component) =>
              resources?.filter(
                (resource) => resource.schema.componentName === component,
              ),
            )
            .flat() as ResourceEntity[],
        }))
        .filter((category) => category.resources?.length > 0),
    [assetsData, resources],
  )

  return { resources, categoryResources }
}

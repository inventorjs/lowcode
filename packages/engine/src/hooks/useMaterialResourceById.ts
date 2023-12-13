import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'

export function useMaterialResourceById(resourceId: string) {
  const { engine } = useEngine()
  const resource = useSelector(() =>
    engine.materials.getResourceById(resourceId),
  )

  return { resource }
}

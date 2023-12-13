import { useEngine } from './useEngine'

export function useMaterialBehaviorByName(componentName: string) {
  const { engine } = useEngine()
  const behavior = engine.materials.getBehaviorByName(componentName)
  return { behavior }
}

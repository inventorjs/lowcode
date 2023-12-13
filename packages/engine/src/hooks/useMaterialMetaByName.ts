import { useEngine } from './useEngine';

export function useMaterialMetaByName(componentName: string) {
  const { engine } = useEngine()
  const meta = engine.materials.getMetaByName(componentName)
  return { meta }
}

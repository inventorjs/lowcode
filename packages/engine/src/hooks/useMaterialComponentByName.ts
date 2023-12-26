import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'

export function useMaterialComponentByName(componentName: string) {
  const { engine } = useEngine()
  const Component = useSelector(() =>
    engine.materials.getComponentByName(componentName),
  )

  return { Component }
}

import { useEngine } from './useEngine';

export function useSetterComponentByName(setterName: string) {
  const { engine } = useEngine()
  const SetterComponent = engine.setters.getSetter(setterName)
  return { SetterComponent }
}

import { useEngine } from '@lowcode/engine'

export function useSave() {
  const { engine } = useEngine()

  const onSave = () =>
    localStorage.setItem('lc-schema', JSON.stringify(engine.project.schema))

  return { onSave }
}

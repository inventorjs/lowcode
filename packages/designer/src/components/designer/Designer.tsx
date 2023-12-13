import { useEngine } from '@lowcode/engine'
import { Workbench } from './layout/Workbench'
import { Previewer } from './previewer/Previewer'

export function Designer() {
  const { engine } = useEngine()

  if (!engine.document) return null

  return (
    <>
      <Workbench />
      <Previewer />
    </>
  )
}

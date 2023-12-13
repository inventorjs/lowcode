import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'

export function useMaterialAssetsData() {
  const { engine } = useEngine()
  const assetsData = useSelector(() => engine.materials.assetsData)
  return { assetsData }
}

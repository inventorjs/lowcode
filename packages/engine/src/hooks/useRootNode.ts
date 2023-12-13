import { useSelector } from 'react-redux';
import { useEngine } from './useEngine';

export function useRootNode() {
  const { engine }  = useEngine()
  const rootNode = useSelector(() => engine.document!.rootNode)
  return { rootNode }
}

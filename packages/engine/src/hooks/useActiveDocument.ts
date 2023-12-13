import { useSelector } from 'react-redux';
import { useEngine } from './useEngine';

export function useActiveDocument() {
  const { engine } = useEngine()
  const activeDocument = useSelector(() => engine.document)
  return { activeDocument }
}

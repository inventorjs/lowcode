import { useContext } from 'react'
import { EngineContext } from '@/context'

export function useEngine() {
  const engine = useContext(EngineContext)
  if (!engine) {
    throw new Error('engine is not exists!')
  }
  return { engine }
}

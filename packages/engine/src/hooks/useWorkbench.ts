import { useEffect, useRef } from 'react'
import { useEngine } from './useEngine'

export function useWorkbench() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const workbenchRef = useRef(false)
  const { engine } = useEngine()

  useEffect(() => {
    if (containerRef.current && engine && !workbenchRef.current) {
      engine.shell.createWorkbench(containerRef.current)
      workbenchRef.current = true
    }
  }, [engine])

  return { containerRef }
}

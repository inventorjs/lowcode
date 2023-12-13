import React, { createContext } from 'react'
import { Provider } from 'react-redux'
import type { IEngine } from '@lowcode/types'

export const EngineContext = createContext<IEngine | null>(null)

export const EngineProvider = ({
  children,
  engine,
}: {
  children: React.ReactNode
  engine: IEngine
}) => {
  return (
    <EngineContext.Provider value={engine}>
      <Provider store={engine.store}>{children}</Provider>
    </EngineContext.Provider>
  )
}

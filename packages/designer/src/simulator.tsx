import React from 'react'
import ReactDOM from 'react-dom/client'
import { EngineProvider, getEngine } from '@lowcode/engine'
import { Simulator } from '@lowcode/simulator'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EngineProvider engine={getEngine()}>
      <Simulator />
    </EngineProvider>
  </React.StrictMode>,
)

import type { SetterComponent } from '@lowcode/types'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { EngineProvider, Engine } from '@lowcode/engine'
import { Designer } from './components/designer'
import { reducer as extReducer } from './store'
import 'antd/dist/reset.css'
import './index.css'
import * as setters from './setters'
import { InitSchemaPlugin } from './plugins/InitSchemaPlugin'
import { Loading } from './components/common/Loading'

const engine = new Engine({
  simulatorUrl: __SIMULATOR_URL__,
  rendererUrl: __RENDERER_URL__,
  assetsUrl: __ASSETS_URL__,
  extReducer,
})

engine.run(async () => {
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  root.render(<Loading />)

  await engine.loadAssets(__ASSETS_URL__)
  await engine.registerPlugin(InitSchemaPlugin)
  await engine.registerSetter(
    setters as unknown as Record<string, SetterComponent>,
  )

  root.render(
    <React.StrictMode>
      <ConfigProvider
        theme={{
          token: {
            fontSize: 12,
          },
        }}
      >
        <EngineProvider engine={engine}>
          <Designer />
        </EngineProvider>
      </ConfigProvider>
    </React.StrictMode>,
  )
})

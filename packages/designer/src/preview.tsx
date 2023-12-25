import React from 'react'
import ReactDOM from 'react-dom/client'
import { Renderer } from '@lowcode/renderer'
import { ProjectSchema } from '@lowcode/types'
import { Assets } from '@lowcode/engine'

;(async () => {
  const assets = new Assets()
  const components = (await assets.loadAssetsComponents(
    ASSETS_URL,
    window,
  )) as Record<string, React.FC>

  const projectSchema = JSON.parse(
    localStorage.getItem('lc-schema') ?? '',
  ) as ProjectSchema

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Renderer
        schema={projectSchema.componentsTree[0]}
        components={components}
      />
    </React.StrictMode>,
  )
})()

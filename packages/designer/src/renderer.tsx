import React from 'react'
import { Assets } from '@inventorjs/lc-engine'
import { createRoot } from 'react-dom/client'
import { Renderer } from '@lowcode/renderer'
import { ProjectSchema } from '@lowcode/types'
;(async function render() {
  const assets = new Assets()
  const { components } = await assets.loadAssets(
    window.__LC_ASSETS_URL__,
    window,
  )

  const projectSchema = JSON.parse(
    await Promise.resolve(localStorage.getItem('lc-schema') ?? '{}'),
  ) as ProjectSchema

  const schema = projectSchema.componentsTree[0]

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Renderer schema={schema} components={components} />
    </React.StrictMode>,
  )
})()

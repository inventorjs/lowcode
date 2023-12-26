import 'systemjs'
import type {
  AssetsSchema,
  ComponentMetaSchema,
  Component,
} from '@lowcode/types'

export class Assets {
  #libraries: string[] = []

  buildComponents(global: Window | null) {
    const components: Record<string, Component> = {}
    if (!global) return components

    for (const library of this.#libraries) {
      if (global && global[library as keyof Window]) {
        Object.entries(global[library as keyof Window]).forEach(
          ([componentName, component]) =>
            (components[componentName] = component as Component),
        )
      }
    }
    return components
  }

  async loadAssetsComponents(
    assets: string | AssetsSchema,
    global: Window | null,
  ) {
    const { assetsData } = await this.loadAssets(assets)

    if (assetsData.cssList) {
      assetsData.cssList.forEach((css) => {
        const cssLink = document.createElement('link')
        cssLink.setAttribute('rel', 'stylesheet')
        cssLink.setAttribute('type', 'text/css')
        cssLink.setAttribute('href', css)
        document.head.append(cssLink)
      })
    }
    let components: Record<string, unknown> = {}
    if (assetsData.jsList) {
      for (const js of assetsData.jsList) {
        await System.import(js)
      }
      components = this.buildComponents(global)
    }
    return components
  }

  async loadAssets(assets: string | AssetsSchema) {
    let assetsJson = assets as AssetsSchema
    if (typeof assets === 'string') {
      assetsJson = (await fetch(assets).then((res) =>
        res.json(),
      )) as AssetsSchema
    }

    const componentsSet = new Set()
    assetsJson.components.forEach((component) => {
      componentsSet.add(component.npm.package)
    })
    assetsJson.packages.forEach((pkg) => {
      if (componentsSet.has(pkg.package)) {
        this.#libraries.push(pkg.library)
      }
    })

    const componentsMetaList = (await Promise.all(
      assetsJson.components.map((component) => System.import(component.url)),
    )) as Record<string, ComponentMetaSchema>[]

    const componentsMeta = componentsMetaList.reduce(
      (result, meta) => ({
        ...result,
        ...meta,
      }),
      {},
    )

    const { packages, sort } = assetsJson
    const editCssList: string[] = []
    const editJsList: string[] = []
    const cssList: string[] = []
    const jsList: string[] = []

    packages.forEach(({ editUrls, urls }) => {
      const realEditUrls = editUrls ?? urls
      realEditUrls?.forEach?.((editUrl) => {
        if (editUrl.endsWith('.css')) {
          editCssList.push(editUrl)
        } else if (editUrl.endsWith('.js')) {
          editJsList.push(editUrl)
        }
      })

      urls?.forEach?.((url) => {
        if (url.endsWith('.css')) {
          cssList.push(url)
        } else if (url.endsWith('.js')) {
          jsList.push(url)
        }
      })
    })

    return {
      componentsMeta,
      assetsData: {
        sort,
        editCssList,
        editJsList,
        cssList,
        jsList,
      },
    }
  }
}

export class AssetsBk {}

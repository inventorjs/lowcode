import { Engine } from '../Engine'
import { projectState, resourceEntity } from '../store'
import { uniqId } from '../../common/util'
import { Behavior } from './Behavior'
import { Meta } from './Meta'
import { Assets } from './Assets'
import type {
  AssetsData,
  AssetsSchema,
  ComponentMetaSchema,
  ComponentSnippetSchema,
  IMaterials,
  MaterialExt,
  NodeSchema,
} from '@lowcode/types'
import { MATERIAL_EXT, ROOT_COMPONENT } from '@/common'
import * as coreComponentsMeta from '@/materials/meta'
import * as coreMaterials from '@/materials'

export class Materials implements IMaterials {
  #metaMap = new Map<string, Meta>()
  #behaviorMap = new Map<string, Behavior>()
  #componentMap = new Map<string, any>(Object.entries(coreMaterials))
  #assets = new Assets()
  #initialData: {
    meta: Record<string, ComponentMetaSchema>
    schema: NodeSchema
  } | null = null

  constructor(private readonly engine: Engine) {}

  get metaMap() {
    return this.#metaMap
  }

  get resources() {
    return resourceEntity.selectors.selectAll(this.engine.state)
  }

  get assetsData() {
    return projectState.selectors.selectAssetsData(this.engine.state)
  }

  get initialData() {
    return this.#initialData
  }

  getComponentByName(componentName: string) {
    if (!this.#componentMap.get(componentName)) {
      const components = this.#assets.buildComponents(
        this.engine.shell.simulatorGlobal,
      )
      this.initComponents(components)
    }
    return this.#componentMap.get(componentName)
  }

  getResourceById(id: string) {
    return resourceEntity.selectors.selectById(this.engine.state, id)
  }

  getMetaByName(componentName: string) {
    return this.metaMap.get(componentName)
  }

  getBehaviorByName(componentName: string) {
    return this.#behaviorMap.get(componentName)
  }

  getPropsSchemaByName(componentName: string) {
    const meta = this.getMetaByName(componentName)
    return meta?.props
  }

  private getSchemaFromSnippet(snippet: ComponentSnippetSchema) {
    return { ...snippet.schema, title: snippet.title }
  }

  private setAssetsData(assetsData: AssetsData) {
    return this.engine.dispatch(projectState.actions.setAssertsData(assetsData))
  }

  private initResources() {
    const resources = Array.from(this.metaMap.values())
      .map((meta) =>
        meta?.snippets?.map(({ title, schema, screenshot }) => ({
          id: uniqId(),
          title,
          screenshot,
          schema: {
            ...schema,
            title,
          },
        })),
      )
      .filter((snippets) => !!snippets)
      .flat()

    this.engine.dispatch(resourceEntity.actions.setAll(resources))
  }

  private initBehaviors() {
    Array.from(this.metaMap.values()).forEach((meta) =>
      this.#behaviorMap.set(meta.componentName, new Behavior(meta)),
    )
  }

  private initMetas() {
    const initialData = this.#initialData
    if (!initialData) return
    Object.values({ ...initialData.meta, ...coreComponentsMeta }).forEach(
      (componentMeta) =>
        componentMeta?.componentName &&
        this.#metaMap.set(componentMeta.componentName, new Meta(componentMeta)),
    )
  }

  private initComponents(components: Record<string, unknown>) {
    Object.entries(components).forEach(([componentName, component]) =>
      this.#componentMap.set(componentName, component),
    )
  }

  async loadAssets(asserts: string | AssetsSchema) {
    const { assetsData, componentsMeta } = await this.#assets.loadAssets(
      asserts,
      this.engine.shell.simulatorGlobal,
    )
    const materialExt = componentsMeta[MATERIAL_EXT] as unknown as MaterialExt
    this.#initialData = (await materialExt?.getInitialData?.(
      componentsMeta,
    )) ?? {
      meta: componentsMeta,
      schema: this.getSchemaFromSnippet(
        componentsMeta?.[ROOT_COMPONENT]?.snippets[0] ??
          coreComponentsMeta[ROOT_COMPONENT].snippets[0],
      ),
    }

    this.setAssetsData(assetsData)
    this.initMetas()
    this.initBehaviors()
    this.initResources()
  }

  destroy() {
    this.#metaMap.clear()
    this.#behaviorMap.clear()
    this.engine.dispatch(resourceEntity.actions.removeAll())
  }
}

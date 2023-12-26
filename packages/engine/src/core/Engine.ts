/**
 * Engine
 */
import type {
  IConfig,
  IEngine,
  EnginePluginCls,
  IMaterials,
  IPlugins,
  IProject,
  IShell,
  SetterComponent,
  AssetsSchema,
  ProjectSchema,
} from '@lowcode/types'
import EventEmitter from 'eventemitter3'
import { EngineEvent, type EngineEventCls } from '@/events'
import { Shell } from '@/shell'
import { Materials } from './materials'
import { configStore, type Reducer } from './store'
import { Plugins } from './Plugins'
import {
  HoverSelectPlugin,
  CanvasMutatePlugin,
  DragDropPlugin,
  NodeEventsPlugin,
} from '@/plugins'
import { ASSETS_URL, RENDERER_URL, SIMULATOR_URL } from '../common/constants'
import { Project } from './Project'
import { Config } from './Config'
import { Setters } from './Setters'

type StoreType = ReturnType<typeof configStore>

export class Engine implements IEngine {
  #isRunning: boolean = false
  #store: StoreType
  #eventBus: EventEmitter = new EventEmitter()
  #materials: IMaterials = new Materials(this)
  #shell: IShell = new Shell(this)
  #plugins: IPlugins = new Plugins(this)
  #config: IConfig = new Config()
  #project: IProject = new Project(this)
  #setters = new Setters()

  constructor({
    extReducer = () => void 0,
    simulatorUrl = '',
    rendererUrl = '',
    assetsUrl = '',
  }: {
    extReducer?: Reducer
    simulatorUrl?: string
    rendererUrl?: string
    assetsUrl?: string
  }) {
    this.#store = configStore(extReducer)
    this.#config.set(SIMULATOR_URL, simulatorUrl)
    this.#config.set(RENDERER_URL, rendererUrl)
    this.#config.set(ASSETS_URL, assetsUrl)

    this.registerCorePlugins()
  }

  get shell() {
    return this.#shell
  }

  get store() {
    return this.#store
  }

  get state() {
    return this.store.getState()
  }

  get dispatch() {
    return this.store.dispatch
  }

  get project() {
    return this.#project
  }

  get materials() {
    return this.#materials
  }

  get plugins() {
    return this.#plugins
  }

  get config() {
    return this.#config
  }

  get setters() {
    return this.#setters
  }

  get document() {
    return this.project.activeDocument
  }

  get isRunning() {
    return this.#isRunning
  }

  async run(runEngine: () => Promise<void>) {
    this.#isRunning = false
    await runEngine()
    this.#isRunning = true
  }

  loadAssets(assets: string | AssetsSchema) {
    if (this.#isRunning) return
    return this.#materials.loadAssets(assets)
  }

  dispatchEvent = (event: EngineEvent) => {
    this.#eventBus.emit((event.constructor as EngineEventCls).eventName, event)
  }

  subscribeEvent = <T, D>(
    E: { new (): T; eventName: string },
    handler: (event: D) => void,
  ) => {
    this.#eventBus.on(E.eventName, handler)
    return () => {
      this.#eventBus.off(E.eventName, handler)
    }
  }

  async registerPlugin(Plugin: EnginePluginCls) {
    if (this.#isRunning) return
    return this.plugins.registerPlugin(Plugin)
  }

  async registerSetter(
    setterName: string | Record<string, SetterComponent>,
    setter?: SetterComponent,
  ) {
    if (this.#isRunning) return
    return this.setters.registerSetter(setterName, setter)
  }

  schema() {
    return this.project.schema
  }

  setSchema(projectSchema: ProjectSchema) {
    this.project.setSchema(projectSchema)
  }

  private async registerCorePlugins() {
    const corePlugins = [
      DragDropPlugin,
      HoverSelectPlugin,
      CanvasMutatePlugin,
      NodeEventsPlugin,
    ]
    for (const CorePlugin of corePlugins) {
      await this.plugins.registerPlugin(CorePlugin)
    }
  }

  destroy() {
    this.plugins.destroy()
    this.project?.destroy()
    this.materials.destroy()
    this.shell.destory()
  }
}

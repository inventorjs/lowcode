import type {
  IEngine,
  IPlugins,
  EnginePluginCls,
  IEnginePlugin,
} from '@lowcode/types'

export class Plugins implements IPlugins {
  #plugins: IEnginePlugin[] = []

  constructor(private readonly engine: IEngine) {}

  async registerPlugin(EnginePlugin: EnginePluginCls) {
    const plugin = new EnginePlugin(this.engine)
    await plugin.init()
    this.#plugins.push(plugin)
  }

  destroy() {
    this.#plugins.forEach((plugin) => plugin.destroy())
  }
}

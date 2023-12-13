import type { IConfig } from '@lowcode/types'

export class Config implements IConfig {
  #simulatorUrl: string = ''
  #configMap = new Map<string, unknown>()

  get simulatorUrl() {
    return this.#simulatorUrl
  }

  setSimulatorUrl(url: string) {
    this.#simulatorUrl = url
  }

  get(key: string) {
    this.#configMap.get(key)
  }

  set(key: string, val: unknown) {
    this.#configMap.set(key, val)
  }
}

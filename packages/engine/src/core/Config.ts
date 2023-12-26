import type { IConfig } from '@lowcode/types'

export class Config implements IConfig {
  #configMap = new Map<string, unknown>()

  get(key: string) {
    return this.#configMap.get(key)
  }

  set(key: string, val: unknown) {
    this.#configMap.set(key, val)
  }
}

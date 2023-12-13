import type { SetterComponent } from '@lowcode/types'

export class Setters {
  #setterMap = new Map<string, SetterComponent>()

  registerSetter(
    setterName: string | Record<string, SetterComponent>,
    setter?: SetterComponent,
  ) {
    if (typeof setterName === 'string') {
      setter && this.#setterMap.set(setterName, setter)
    } else {
      Object.entries(setterName).forEach(([setterName, setter]) =>
        this.#setterMap.set(setterName, setter),
      )
    }
  }

  getSetter(setterName: string) {
    return this.#setterMap.get(setterName)
  }

  destroy() {
    this.#setterMap.clear()
  }
}

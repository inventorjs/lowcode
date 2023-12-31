export type * from './schemas'
export type * from './types'
export type * from './interfaces'

import type { IEngine } from './interfaces'
import type { LCTarget } from './types'

declare global {
  interface HTMLElement {
    __LC_TARGET: LCTarget
  }

  interface Window {
    __LC_ENGINE: IEngine
    __LC_CANVAS: boolean
    __LC_MATERIAL_COMPONENTS: Record<string, any>
    __LC_ASSETS_URL__: string
  }

  const __SIMULATOR_URL__: string
  const __RENDERER_URL__: string
  const __ASSETS_URL__: string
}

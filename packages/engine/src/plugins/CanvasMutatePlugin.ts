/**
 * 悬停插件
 */
import type { IEngine, IEnginePlugin } from '@lowcode/types'
import { CanvasMutateEvent } from '@/events'

export class CanvasMutatePlugin implements IEnginePlugin {
  #unsubscribers: Array<() => void> = []
  constructor(private readonly engine: IEngine) {}

  async init() {
    this.#unsubscribers.push(
      this.engine.subscribeEvent(
        CanvasMutateEvent,
        this.handleCanvasMutate,
      ),
    )
  }

  handleCanvasMutate = (ev: CanvasMutateEvent) => {
    const { eventData } = ev
    if (!eventData) return
    this.engine.project.activeDocument?.setCanvasState(eventData)
  }

  destroy() {
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe())
    this.#unsubscribers = []
  }
}

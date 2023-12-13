/**
 * Node 事件插件
 */
import type { IEngine, IEnginePlugin, INode } from '@lowcode/types'
import { NodeAddEvent, NodeRemoveEvent, EngineNodeEvent } from '@/events'

export class NodeEventsPlugin implements IEnginePlugin {
  #unsubscribers: Array<() => void> = []
  constructor(private readonly engine: IEngine) {}

  async init() {
    this.#unsubscribers.push(
      this.engine.subscribeEvent(NodeAddEvent, this.handleNodeAdd),
      this.engine.subscribeEvent(NodeRemoveEvent, this.handleNodeRemove),
    )
  }

  handleNodeAdd = (evt: NodeAddEvent) => {
    return this.handleNodeEvent(evt, 'add')
  }

  handleNodeRemove = (evt: NodeRemoveEvent) => {
    return this.handleNodeEvent(evt, 'remove')
  }

  handleNodeEvent(evt: EngineNodeEvent, type: string) {
    const metas = [...this.engine.materials.metaMap.values()]
    if (!metas.length || !evt.node) return

    const addCallbacks: Record<string, (node: INode, engine: IEngine) => void> =
      {}
    const removeCallbacks: Record<
      string,
      (node: INode, engine: IEngine) => void
    > = {}

    for (const meta of metas) {
      if (meta?.onNodeAdd) {
        addCallbacks[meta.componentName] = meta.onNodeAdd
      }
      if (meta?.onNodeRemove) {
        removeCallbacks[meta.componentName] = meta.onNodeRemove
      }
    }
    let callbacks: Array<(node: INode, engine: IEngine) => void> = []
    if (type === 'add') {
      callbacks = Object.values(addCallbacks)
    } else if (type === 'remove') {
      callbacks = Object.values(removeCallbacks)
    }
    if (callbacks.length > 0) {
      for (const callback of callbacks) {
        callback(evt.node, this.engine)
      }
    }
  }

  destroy() {
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe())
    this.#unsubscribers = []
  }
}

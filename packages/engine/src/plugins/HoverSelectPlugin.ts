/**
 * 悬停插件
 */
import type { IEngine, IEnginePlugin } from '@lowcode/types'
import { MouseleaveEvent, MouseoverEvent, MouseclickEvent } from '@/events'

export class HoverSelectPlugin implements IEnginePlugin {
  #unsubscribers: Array<() => void> = []
  constructor(private readonly engine: IEngine) {}

  async init() {
    this.#unsubscribers.push(
      this.engine.subscribeEvent(MouseoverEvent, this.handleMouseover),
      this.engine.subscribeEvent(MouseleaveEvent, this.handleMouseleave),
      this.engine.subscribeEvent(MouseclickEvent, this.handleMouseclick),
    )
  }

  handleMouseover = (evt: MouseoverEvent) => {
    const { lcTarget } = evt
    if (!lcTarget) return

    const activedNode = this.engine.document?.activeNode
    const targetNode = this.engine.document?.getNodeById(lcTarget.id)
    const behavior = targetNode?.behavior

    if (
      !behavior ||
      !behavior.canHover() ||
      activedNode?.id === lcTarget.id
    ) {
      this.engine.document?.setHoverNodeId(null)
      return
    }
    this.engine.document?.setHoverNodeId(targetNode.id)
  }

  handleMouseleave = () => {
    const hoverNode = this.engine.document?.hoverNodeId
    if (!hoverNode) return
    this.engine.document?.setHoverNodeId(null)
  }

  handleMouseclick = (evt: MouseclickEvent) => {
    const { lcTarget } = evt
    if (!lcTarget) return
    const targetNode = this.engine.document?.getNodeById(lcTarget.id)
    if (!targetNode) return
    let activeNodeId = targetNode.id
    const behavior = targetNode.behavior
    if (!behavior?.canSelect()) {
      activeNodeId = targetNode.parentId as string
    }
    this.engine.document?.setActiveNodeId(activeNodeId)
  }

  destroy() {
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe())
    this.#unsubscribers = []
  }
}

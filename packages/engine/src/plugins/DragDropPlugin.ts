/**
 * 拖拽插件
 */
import type {
  DragoverTarget,
  AlignDirection,
  AlignPosition,
  IEngine,
  IEnginePlugin,
  IMeta,
  INode,
} from '@lowcode/types'
import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragLeaveEvent,
} from '@/events'

export class DragDropPlugin implements IEnginePlugin {
  #unsubscribers: Array<() => void> = []

  constructor(private readonly engine: IEngine) {}

  async init() {
    this.#unsubscribers.push(
      this.engine.subscribeEvent(DragStartEvent, this.handleDragStart),
      this.engine.subscribeEvent(DragEndEvent, this.handleDragEnd),
      this.engine.subscribeEvent(DragOverEvent, this.handleDragOver),
      this.engine.subscribeEvent(DragLeaveEvent, this.handleDragLeave),
    )
  }

  getPadding(size: number, isContainer = false) {
    const maxPadding = 30
    const minPadding = 3
    const paddingRadio = isContainer ? 0.15 : 0.5
    const padding = Math.min(
      Math.max(size * paddingRadio, minPadding),
      isContainer ? maxPadding : size / 2,
    )

    return padding
  }

  isInRect(evt: DragOverEvent, domRect: DOMRect, isContainer: boolean) {
    const { clientX, clientY } = evt
    const { top, left, width, height } = domRect
    const paddingX = this.getPadding(width, isContainer)
    const paddingY = this.getPadding(height, isContainer)

    if (
      clientX - left > paddingX &&
      clientX - left < width - paddingX &&
      clientY - top > paddingY &&
      clientY - top < height - paddingY
    ) {
      return true
    }
    return false
  }

  getNodeAlignData(evt: DragOverEvent, node: INode) {
    const nodeDom = this.engine.document?.getNodeDomById(node.id)
    if (!nodeDom) return null
    const domRect = nodeDom.getBoundingClientRect()
    const { offsetX, offsetY } = evt
    const { width, height } = domRect

    let nodeId: string | null = null
    let alignPosition: AlignPosition = 'in'
    let alignDirection: AlignDirection = 'vertical'
    const meta = node.meta as IMeta

    if (this.isInRect(evt, domRect, !!meta.isContainer)) {
      // 鼠标在内容区
      nodeId = node.id
      if (!node.childIds?.length) {
        alignPosition = 'in'
      } else {
        // 存在 children 则计算相对 children 的插入位置
        const afterChildId = this.getNearestChild(evt, node, 'after')
        const beforeIndex = afterChildId
          ? node.childIds.findIndex((id) => id === afterChildId) - 1
          : node.childIds.length - 1
        const beforeChildId = node.childIds[beforeIndex]
        if (beforeChildId) {
          const beforeNodeDom =
            this.engine.document?.getNodeDomById(beforeChildId)
          if (beforeNodeDom) {
            nodeId = beforeChildId
            alignDirection = this.getAlignDirection(beforeNodeDom)
            alignPosition = alignDirection === 'vertical' ? 'bottom' : 'right'
          }
        } else if (afterChildId) {
          const afterNodeDom =
            this.engine.document?.getNodeDomById(afterChildId)
          if (afterNodeDom) {
            nodeId = afterChildId
            alignDirection = this.getAlignDirection(afterNodeDom)
            alignPosition = alignDirection === 'vertical' ? 'top' : 'left'
          }
        }
      }
    } else {
      nodeId = node.id
      const nodeDom = this.engine.document?.getNodeDomById(node.id)
      alignDirection = this.getAlignDirection(nodeDom)
      if (alignDirection === 'vertical') {
        if (offsetY / (height - offsetY) <= 1) {
          alignPosition = 'top'
        } else {
          alignPosition = 'bottom'
        }
      } else {
        if (offsetX / (width - offsetX) <= 1) {
          alignPosition = 'left'
        } else {
          alignPosition = 'right'
        }
      }
    }
    return { nodeId, alignPosition, alignDirection }
  }

  getAlignDirection(nodeDom?: HTMLElement): AlignDirection {
    if (!nodeDom || !nodeDom.parentElement) {
      return 'vertical'
    }
    const computedStyle = getComputedStyle(nodeDom)
    const parentComputedStyle = getComputedStyle(nodeDom.parentElement)

    if (
      (parentComputedStyle.display === 'flex' &&
        parentComputedStyle.flexDirection === 'row') ||
      ['inline-block', 'inline'].includes(computedStyle.display) ||
      computedStyle.float !== 'none'
    ) {
      return 'horizontal'
    }

    return 'vertical'
  }

  getNearestChild(
    ev: DragOverEvent,
    parentNode: INode,
    nearType: 'before' | 'after',
  ) {
    const { childIds = [] } = parentNode
    const { clientX, clientY } = ev
    const childId = childIds.find((childId) => {
      const childDom = this.engine.document?.getNodeDomById(childId)
      if (!childDom) return false
      const { top, left, right, bottom } = childDom.getBoundingClientRect()
      if (nearType === 'after' && (clientY < top || clientX < left)) {
        return true
      }
      if (nearType === 'before' && (clientY > bottom || clientX > right)) {
        return true
      }
      return false
    })
    return childId
  }

  canAccept({
    nodeId,
    alignPosition,
  }: {
    nodeId: string
    alignPosition: AlignPosition | null
  }) {
    const draggingTarget = this.engine.document?.dragingTarget
    if (!draggingTarget) return
    let componentName = ''

    if (draggingTarget.type === 'resource') {
      const resource = this.engine.materials.getResourceById(draggingTarget.id)
      if (!resource) return
      componentName = resource.schema.componentName
    } else {
      const draggingNode = this.engine.document?.getNodeById(draggingTarget.id)
      if (!draggingNode) return
      componentName = draggingNode.componentName
    }

    let targetNode = this.engine.document?.getNodeById(nodeId)

    const siblingMetaList: IMeta[] = []
    if (alignPosition !== 'in') {
      targetNode = targetNode?.parentNode
      if (!targetNode) return

      const childIndex =
        targetNode?.childIds.findIndex((id) => id === nodeId) ?? -1
      if (childIndex > -1 && targetNode) {
        const siblingNode = this.engine.document?.getNodeById(nodeId)
        siblingNode && siblingMetaList.push(siblingNode.meta as IMeta)
        let otherChildIndex = childIndex
        if (['top', 'left'].includes(alignPosition as string)) {
          otherChildIndex = childIndex - 1
        } else {
          otherChildIndex = childIndex + 1
        }
        if (
          otherChildIndex > -1 &&
          otherChildIndex < targetNode.childIds.length &&
          otherChildIndex !== childIndex
        ) {
          const siblingNode = this.engine.document?.getNodeById(nodeId)
          siblingNode && siblingMetaList.push(siblingNode?.meta as IMeta)
        }
      }
    }

    if (!targetNode) return

    const draggingMeta = this.engine.materials.getMetaByName(componentName)
    const ancestorMetaList = targetNode?.ancestorNodes
      ?.map((node) => node.meta)
      .filter((meta) => !!meta) as IMeta[]

    if (
      !draggingMeta ||
      !targetNode.behavior ||
      !targetNode.behavior.canDrop(draggingMeta, siblingMetaList, ancestorMetaList)
    )
      return false
    return true
  }

  handleDragStart = (evt: DragStartEvent) => {
    const { lcTarget } = evt
    this.engine.document?.setDraggingTarget(lcTarget)
  }

  handleDragOver = (evt: DragOverEvent) => {
    const { lcTarget } = evt
    const node = this.engine.document?.getNodeById(lcTarget!.id)
    if (!node || !node.meta) return

    let nodeAlignData = null
    if (node.isSlot) {
      nodeAlignData = {
        nodeId: node.id,
        alignPosition: 'in' as const,
        alignDirection: 'vertical' as const,
      }
    } else {
      nodeAlignData = this.getNodeAlignData(evt, node)
    }
    if (
      !nodeAlignData ||
      !nodeAlignData.nodeId ||
      !nodeAlignData.alignPosition ||
      !nodeAlignData.alignDirection
    ) {
      return this.engine.document?.setDragoverTarget(null)
    }

    const { nodeId, alignPosition, alignDirection } = nodeAlignData
    const targetNode = this.engine.document?.getNodeById(nodeId)
    if (!targetNode) return
    const acceptStatus =
      alignPosition !== 'in' && !targetNode.parentId
        ? 'reject'
        : this.canAccept(nodeAlignData)
        ? 'accept'
        : 'reject'
    const dragoverTarget: DragoverTarget = {
      nodeId,
      acceptStatus,
      alignPosition,
      alignDirection,
    }
    this.engine.document?.setDragoverTarget(dragoverTarget)
  }

  handleDragEnd = () => {
    const draggingTarget = this.engine.document?.dragingTarget
    const dragoverTarget = this.engine.document?.dragoverTarget
    this.engine.document?.setDraggingTarget(null)
    this.engine.document?.setDragoverTarget(null)

    if (!draggingTarget || dragoverTarget?.acceptStatus !== 'accept') {
      return
    }

    const node = this.engine.document?.getNodeById(dragoverTarget.nodeId)
    if (!node) return

    let draggingNode: INode | undefined
    if (draggingTarget.type === 'resource') {
      const resource = this.engine.materials.getResourceById(draggingTarget.id)
      if (!resource) return
      draggingNode = this.engine.document?.createNode(resource.schema, null)
    } else {
      draggingNode = this.engine.document?.getNodeById(
        draggingTarget.id,
      ) as INode
    }

    if (!draggingNode) return

    if (dragoverTarget.alignPosition === 'in') {
      node.appendChild(draggingNode)
    } else {
      if (!node.parentId) return
      switch (dragoverTarget.alignPosition) {
        case 'top':
        case 'left':
          node.parentNode?.insertBefore(draggingNode, node.id)
          break
        case 'bottom':
        case 'right':
          node.parentNode?.insertAfter(draggingNode, node.id)
          break
      }
    }
    setTimeout(
      () =>
        draggingNode && this.engine.document?.setActiveNodeId(draggingNode.id),
    )
  }

  handleDragLeave = () => {
    this.engine.document?.setDragoverTarget(null)
  }

  destroy() {
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe())
    this.#unsubscribers = []
  }
}

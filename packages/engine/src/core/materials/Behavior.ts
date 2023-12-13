import type { IBehavior } from '@lowcode/types'
import { type Meta } from './Meta'

export class Behavior implements IBehavior {
  constructor(private readonly meta: Meta) { }

  canDrop(fromMeta: Meta, siblingMetaList: Meta[] = [], ancestorMetaList: Meta[] = []) {
    const isContainer = this.meta.isContainer
    if (!isContainer) return false

    const fromNestingRule = fromMeta.nestingRule
    const nestingRule = this.meta.nestingRule

    if (!fromNestingRule && !nestingRule && !siblingMetaList.length) return true

    const { parentWhiteList, siblingWhiteList, ancestorBlackList } = fromNestingRule ?? {}
    const { childWhiteList } = nestingRule ?? {}

    let allowParent = false
    let allowChild = false
    let allowBySiblings = false
    let allowSiblings = false
    let allowAncestor = false

    if (!parentWhiteList || parentWhiteList.includes(this.meta.componentName)) {
      allowParent = true
    }
    if (!childWhiteList || childWhiteList.includes(fromMeta.componentName)) {
      allowChild = true
    }

    if (
      !siblingMetaList.length ||
      siblingMetaList.every((meta) => {
        const { siblingWhiteList } = meta.nestingRule ?? {}
        if (
          !siblingWhiteList ||
          siblingWhiteList.includes(fromMeta.componentName)
        ) {
          return true
        }
        return false
      })
    ) {
      allowBySiblings = true
    }
    if (
      !siblingWhiteList ||
      !siblingMetaList.length ||
      siblingMetaList.every((meta) =>
        siblingWhiteList.includes(meta.componentName),
      )
    ) {
      allowSiblings = true
    }

    if (!ancestorBlackList
      || !ancestorMetaList?.length
      || ancestorMetaList.every((meta) => !ancestorBlackList.includes(meta.componentName))) {
      allowAncestor = true
    }

    return allowParent && allowChild && allowBySiblings && allowSiblings && allowAncestor
  }

  canMove() {
    return !this.meta.disableBehaviors?.includes('move')
  }

  canCopy() {
    return !this.meta.disableBehaviors?.includes('copy')
  }

  canRemove() {
    return !this.meta.disableBehaviors?.includes('remove')
  }

  canHover() {
    return !this.meta.disableBehaviors?.includes('hover')
  }

  canSelect() {
    return !this.meta.disableBehaviors?.includes('select')
  }
}

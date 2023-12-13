import { LC_TARGET } from '@/common/constants'
import type { LCTarget } from '@lowcode/types'

export class AbsEventDriver {
  getNearestLCTargetElement(
    elem: HTMLElement | null,
  ): { target: LCTarget; element: HTMLElement } | null {
    if (!elem || elem === document.body) {
      return null
    }
    if (elem[LC_TARGET]) {
      return { target: elem[LC_TARGET], element: elem }
    } else {
      return this.getNearestLCTargetElement(elem.parentElement)
    }
  }

  destroy() {
    // empty
  }
}

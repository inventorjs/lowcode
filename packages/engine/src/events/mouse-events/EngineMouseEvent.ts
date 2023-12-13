/**
 * mouseleave
 */

import type { LCTarget } from '@lowcode/types'
import { EngineEvent } from '../EngineEvent'

export interface MouseEventData {
  nativeEvent: MouseEvent
  lcTargetElement: {
    target: LCTarget
    element: HTMLElement
  }
}

export abstract class EngineMouseEvent extends EngineEvent<MouseEventData> {
  offsetX: number = 0
  offsetY: number = 0
  clientX: number = 0
  clientY: number = 0
  nativeEvent: MouseEvent | null = null
  lcTarget: LCTarget | null = null
  lcElement: HTMLElement | null = null

  constructor(eventData?: MouseEventData) {
    super()
    if (!eventData) {
      return
    }
    const {
      lcTargetElement: { target, element },
      nativeEvent,
    } = eventData

    const { x, y } = element.getBoundingClientRect()
    const { clientX, clientY } = nativeEvent

    this.offsetX = clientX - x
    this.offsetY = clientY - y
    this.clientX = nativeEvent.clientX
    this.clientY = nativeEvent.clientY
    this.nativeEvent = nativeEvent
    this.lcTarget = target
    this.lcElement = element
  }
}

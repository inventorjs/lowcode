import type { LCTarget } from '@lowcode/types'

export type EngineEventCls<T = unknown> = {
  new (eventData?: T): EngineEvent<T>
  eventName: string
}

export abstract class EngineEvent<T = unknown> {
  static eventName: string
  eventData: T

  constructor(eventData?: T) {
    let realEventData = eventData as {
      nativeEvent: MouseEvent
      target: LCTarget
      element: HTMLElement
    }
    if (
      realEventData?.nativeEvent &&
      realEventData?.target &&
      realEventData?.element
    ) {
      const { x, y } = realEventData.element.getBoundingClientRect()
      const { clientX, clientY } = realEventData.nativeEvent
      realEventData = {
        ...realEventData,
        nativeEvent: {
          ...realEventData.nativeEvent,
          offsetX: clientX - x,
          offsetY: clientY - y,
          target: realEventData.element,
        },
      }
    }

    this.eventData = realEventData as T
  }
}

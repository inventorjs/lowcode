/**
 * dragover事件驱动
 */
import { AbsEventDriver } from './AbsEventDriver'
import { DragLeaveEvent, DragOverEvent, type EngineEvent } from '../../events'

export class DragoverDriver extends AbsEventDriver {
  element: HTMLElement
  eventData: {
    clientX: number
    clientY: number
  } | null = null

  constructor(
    elem: HTMLElement,
    private dispatchEvent: (event: EngineEvent) => void,
  ) {
    super()
    this.element = ((elem as HTMLIFrameElement)?.contentDocument ??
      elem) as HTMLElement
    this.element.addEventListener('dragover', this.handleDragOver)
  }

  handleDragOver = (evt: DragEvent) => {
    evt.preventDefault()
    if (
      this.eventData &&
      this.eventData.clientX === evt.clientX &&
      this.eventData.clientY === evt.clientY
    ) {
      return
    }
    this.eventData = {
      clientX: evt.clientX,
      clientY: evt.clientY,
    }
    const lcTargetElement = this.getNearestLCTargetElement(
      evt.target as HTMLElement,
    )
    if (!lcTargetElement) {
      return this.dispatchEvent(new DragLeaveEvent())
    }
    this.dispatchEvent(new DragOverEvent({ nativeEvent: evt, lcTargetElement }))
  }

  handleDragLeave = () => {
    return this.dispatchEvent(new DragLeaveEvent())
  }

  destroy() {
    this.element.removeEventListener('dragover', this.handleDragOver)
  }
}

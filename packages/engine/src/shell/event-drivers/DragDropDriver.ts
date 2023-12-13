/**
 * drag drop事件驱动
 */
import { DragEndEvent, DragStartEvent, type EngineEvent } from '../../events'
import { AbsEventDriver } from './AbsEventDriver'

export class DragDropDriver extends AbsEventDriver {
  element: HTMLElement

  constructor(
    elem: HTMLElement,
    private dispatchEvent: (event: EngineEvent) => void,
  ) {
    super()
    this.element = ((elem as HTMLIFrameElement)?.contentDocument ??
      elem) as HTMLElement
    this.element.addEventListener('dragstart', this.handleDragStart)
    this.element.addEventListener('dragend', this.handleDragEnd)
  }

  handleDragStart = (evt: DragEvent) => {
    const lcTargetElement = this.getNearestLCTargetElement(
      evt.target as HTMLElement,
    )
    if (!lcTargetElement) return
    this.dispatchEvent(
      new DragStartEvent({ nativeEvent: evt, lcTargetElement }),
    )
  }

  handleDragEnd = () => {
    this.dispatchEvent(new DragEndEvent())
  }

  destroy() {
    this.element.removeEventListener('dragstart', this.handleDragStart)
    this.element.removeEventListener('dragend', this.handleDragEnd)
  }
}

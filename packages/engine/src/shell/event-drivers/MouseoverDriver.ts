import { AbsEventDriver } from './AbsEventDriver'
import { type EngineEvent, MouseoverEvent, MouseleaveEvent } from '../../events'

export class MouseoverDriver extends AbsEventDriver {
  element: HTMLElement

  constructor(
    elem: HTMLElement,
    private dispatchEvent: (event: EngineEvent) => void,
  ) {
    super()
    this.element = ((elem as HTMLIFrameElement)?.contentDocument ??
      elem) as HTMLElement
    this.element.addEventListener('mouseover', this.handleMouseover)
    this.element.addEventListener('mouseleave', this.handleMouseleave)
  }

  handleMouseover = (ev: MouseEvent) => {
    const lcTargetElement = this.getNearestLCTargetElement(
      ev.target as HTMLElement,
    )
    if (!lcTargetElement) {
      return this.dispatchEvent(new MouseleaveEvent())
    }
    this.dispatchEvent(new MouseoverEvent({ nativeEvent: ev, lcTargetElement }))
  }

  handleMouseleave = () => {
    this.dispatchEvent(new MouseleaveEvent())
  }
}

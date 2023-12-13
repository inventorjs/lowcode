import { AbsEventDriver } from './AbsEventDriver'
import { type EngineEvent, MouseclickEvent } from '../../events'

export class MouseclickDriver extends AbsEventDriver {
  #element: HTMLElement

  constructor(
    elem: HTMLElement,
    private dispatchEvent: (event: EngineEvent) => void,
  ) {
    super()
    this.#element = ((elem as HTMLIFrameElement)?.contentDocument ??
      elem) as HTMLElement
    this.#element.addEventListener('click', this.handleClick)
  }

  handleClick = (ev: MouseEvent) => {
    const lcTargetElement = this.getNearestLCTargetElement(
      ev.target as HTMLElement,
    )
    if (!lcTargetElement) return
    this.dispatchEvent(
      new MouseclickEvent({ nativeEvent: ev, lcTargetElement }),
    )
  }
}

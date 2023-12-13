/**
 * 画布事件驱动
 */
import { CanvasMutateEvent, type EngineEvent } from '../../events'
import { AbsEventDriver } from './AbsEventDriver'

export class CanvasMutateDriver extends AbsEventDriver {
  contentDocument: Document | null
  contentWindow: Window | null

  constructor(
    private readonly iframe: HTMLIFrameElement,
    private dispatchEvent: (event: EngineEvent) => void,
  ) {
    super()
    this.contentDocument = iframe.contentDocument
    this.contentWindow = iframe.contentWindow
    this.contentDocument?.addEventListener('scroll', this.handleMutate, {
      passive: true,
      capture: true,
    })
    this.contentWindow?.addEventListener('resize', this.handleMutate, {
      passive: true,
      capture: true,
    })
    window.addEventListener('resize', this.handleMutate, {
      passive: true,
    })
    document.addEventListener('scroll', this.handleMutate, {
      passive: true,
    })
    this.handleMutate()
  }

  handleMutate = () => {
    const scrollTop = this.contentDocument?.documentElement.scrollTop ?? 0
    const scrollLeft = this.contentDocument?.documentElement.scrollLeft ?? 0
    const domRect = this.iframe.getBoundingClientRect()
    this.dispatchEvent(
      new CanvasMutateEvent({
        scroll: {
          top: scrollTop,
          left: scrollLeft,
        },
        domRect: {
          top: domRect.top,
          left: domRect.left,
          width: domRect.width,
          height: domRect.height,
        },
      }),
    )
  }

  destroy() {
    this.contentDocument?.removeEventListener('scroll', this.handleMutate)
    this.contentWindow?.removeEventListener('resize', this.handleMutate)
    window.removeEventListener('resize', this.handleMutate)
    document.removeEventListener('scroll', this.handleMutate)
  }
}

/**
 * 终端管理
 */
import { IEngine, IShell } from '@lowcode/types'
import {
  type AbsEventDriver,
  DragDropDriver,
  DragoverDriver,
  MouseoverDriver,
  MouseclickDriver,
  CanvasMutateDriver,
} from './event-drivers'

export class Shell implements IShell {
  #workbenchDrivers: AbsEventDriver[] = []
  #iframeCanvasDrivers: AbsEventDriver[] = []
  #simulatorGlobal: Window | null = null

  constructor(private readonly engine: IEngine) {}

  get simulatorGlobal() {
    return this.#simulatorGlobal
  }

  createWorkbench(container: HTMLElement) {
    this.#workbenchDrivers.push(
      new DragDropDriver(container, this.engine.dispatchEvent),
    )
  }

  createIframeCanvas(iframeElement: HTMLIFrameElement) {
    this.#simulatorGlobal = iframeElement.contentWindow
    this.#iframeCanvasDrivers.push(
      new DragDropDriver(iframeElement, this.engine.dispatchEvent),
      new DragoverDriver(iframeElement, this.engine.dispatchEvent),
      new MouseoverDriver(iframeElement, this.engine.dispatchEvent),
      new MouseclickDriver(iframeElement, this.engine.dispatchEvent),
      new CanvasMutateDriver(iframeElement, this.engine.dispatchEvent),
    )
  }

  destory() {}
}

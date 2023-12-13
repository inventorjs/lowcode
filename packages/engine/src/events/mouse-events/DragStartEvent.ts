/**
 * dragstart event
 */
import { EngineMouseEvent } from './EngineMouseEvent'

export class DragStartEvent extends EngineMouseEvent {
  static eventName = 'engine:dragstart'
}

/**
 * drop
 */
import { EngineMouseEvent } from './EngineMouseEvent';

export class DropEvent extends EngineMouseEvent {
  static eventName = 'engine:drop'
}

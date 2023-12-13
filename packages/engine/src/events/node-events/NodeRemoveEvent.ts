import { EngineNodeEvent } from './EngineNodeEvent';

export class NodeRemoveEvent extends EngineNodeEvent {
  static eventName = 'engine:node-remove'
}

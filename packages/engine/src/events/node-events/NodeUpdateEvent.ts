import { EngineNodeEvent } from './EngineNodeEvent';

export class NodeUpdateEvent extends EngineNodeEvent {
  static eventName = 'engine:node-update'
}

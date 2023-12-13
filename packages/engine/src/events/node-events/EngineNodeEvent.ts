import type { INode } from '@lowcode/types';
import { EngineEvent } from '../EngineEvent';

export interface NodeEventData {
  node?: INode
}

export abstract class EngineNodeEvent extends EngineEvent<NodeEventData> {
  node?: INode | null = null

  constructor(eventData?: NodeEventData) {
    super()
    if (eventData) {
      this.node = eventData.node
    }
  }
}

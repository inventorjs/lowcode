import type React from 'react'
import type { NodeSchema, ComponentSnippetSchema } from './schemas'

export type LcTargetType = 'resource' | 'node'
export type AcceptStatus = 'accept' | 'reject'
export type AlignPosition = 'top' | 'left' | 'bottom' | 'right' | 'in'
export type AlignDirection = 'vertical' | 'horizontal'
export type BehaviorRule = 'move' | 'remove' | 'copy' | 'hover' | 'select'

export type DraggingTarget = LCTarget

export type DragoverTarget = {
  nodeId: string
  alignPosition: AlignPosition
  alignDirection: AlignDirection
  acceptStatus: AcceptStatus
} | null

export interface LCTarget {
  id: string
  type: LcTargetType
}

export interface DOMRect {
  top: number
  left: number
  width: number
  height: number
}

export interface CanvasState {
  scroll: {
    top: number
    left: number
  }
  domRect: DOMRect
}

export interface TitleConfig {
  label: string
  tip: string
}

export type TitleContent = TitleConfig | string

export type Props = {
  [k: string]: unknown
  children?: React.ReactNode
  __lcmode?: 'design' | 'preview'
}

export type JSSlot = {
  type: 'JSSlot'
  value: NodeSchema[]
  id?: string
  enabled?: boolean
  params?: string[]
  title?: string
}

export type JSFunction = {
  type: 'JSFunction'
  value: string
  title?: string
}

export type JSExpression = {
  type: 'JSExpression'
  value: string
  title?: string
}

export interface NodeEntity {
  id: string
  title: string
  componentName: string
  resourceName?: string
  props: Props
  childIds: string[]
  parentId: string | null
  documentId: string
  childNodes?: NodeEntity[]
  locked: boolean
  hidden: boolean
  binding?: {
    ids?: string[],
    toId?: string,
  },
}

export interface DocumentEntity {
  id: string
  title: string
  rootNodeId: string
  activeNodeId: string | null
}

export interface ResourceEntity extends ComponentSnippetSchema {
  id: string
  title: string
  screenshot?: string
  schema: NodeSchema
}

export type Component<T = unknown> = React.FC<T>

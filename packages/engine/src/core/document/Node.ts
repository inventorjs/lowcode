import type {
  IDocument,
  IEngine,
  NodeSchema,
  NodeEntity,
  Props,
  JSSlot,
  INode,
} from '@lowcode/types'
import { SLOT_COMPONENT, isJSSlot, uniqId } from '@/common'
import { NodeAddEvent, NodeRemoveEvent, NodeUpdateEvent } from '@/events'
import { nodeEntity } from '../store'

export class Node implements INode {
  #id: string
  #ownerDocument: IDocument

  constructor(
    schema: NodeSchema,
    parentId: string | null,
    ownerDocument: IDocument,
    private readonly engine: IEngine,
    isClone: boolean,
  ) {
    this.#ownerDocument = ownerDocument
    const node = this.createEntity(schema, parentId, isClone)
    this.#id = node.id
    this.engine.dispatch(nodeEntity.actions.appendChild({ node, parentId }))
  }

  toJson() {
    return (
      nodeEntity.selectors.selectById(this.engine.state, this.id) ??
      ({} as NodeEntity)
    )
  }

  get title() {
    return this.toJson().title
  }

  get props() {
    return this.toJson().props
  }

  get componentName() {
    return this.toJson().componentName
  }

  get meta() {
    return this.engine.materials.getMetaByName(this.componentName)
  }

  get behavior() {
    return this.engine.materials.getBehaviorByName(this.componentName)
  }

  get resourceName() {
    return this.toJson().resourceName
  }

  get locked() {
    return this.toJson().locked
  }

  get hidden() {
    return this.toJson().hidden
  }

  get parentId() {
    return this.toJson().parentId
  }

  get childIds() {
    return this.toJson().childIds
  }

  get isSlot() {
    return this.componentName === SLOT_COMPONENT
  }

  get id() {
    return this.#id
  }

  get schema() {
    const targetNode = nodeEntity.selectors.selectById(
      this.engine.state,
      this.id,
    )
    if (!targetNode) return null

    const {
      id,
      title,
      componentName,
      resourceName,
      childIds,
      binding,
      props,
      locked,
      hidden,
    } = targetNode
    const parsedProps = this.parseSchemaProps(props)
    const schema: NodeSchema = {
      id,
      title,
      componentName,
      resourceName,
      binding,
      children: childIds
        ?.map(
          (childId) =>
            this.ownerDocument.getNodeById(childId)?.schema as NodeSchema,
        )
        .filter(Boolean),
      props: parsedProps,
      locked,
      hidden,
    }
    return schema
  }

  get ownerDocument() {
    return this.#ownerDocument
  }

  get parentNode() {
    return this.ownerDocument.getNodeById(this.toJson().parentId as string)
  }

  get ancestorNodes() {
    const ancestor: INode[] = []
    let node = this.parentNode
    while (node) {
      ancestor.push(node)
      const parentNode = node.parentNode
      if (node === parentNode) break
      node = parentNode
    }
    return ancestor
  }

  get childNodes() {
    return this.toJson()
      ?.childIds.map((childId) => this.ownerDocument.getNodeById(childId))
      .filter(Boolean) as INode[]
  }

  private parseSchemaProps(props: Props) {
    const realProps: Props = {}
    Object.entries(props).forEach(([key, val]) => {
      let slotVal = val as JSSlot
      if (isJSSlot(slotVal) && slotVal.id) {
        const slotNode = this.ownerDocument.getNodeById(slotVal.id)
        slotVal = {
          type: slotVal.type,
          title: slotVal.title,
          value: slotNode?.schema?.children ?? [],
        }
        realProps[key] = slotVal
      } else if (val && typeof val === 'object') {
        realProps[key] = this.parseSchemaProps(val as Props)
      } else {
        realProps[key] = val
      }
    })
    return realProps
  }

  private parseProps(props: Props, nodeId: string, isClone: boolean) {
    if (!props) return {}
    const parsedProps: Props = {}
    Object.entries(props).forEach(([key, val]) => {
      const slotVal = val as JSSlot
      if (isJSSlot(slotVal)) {
        const slotNode = this.ownerDocument.createSlotNode(
          nodeId,
          slotVal,
          isClone,
        )
        parsedProps[key] = {
          ...slotVal,
          title: slotVal?.title ?? key,
          enabled: !!slotVal.value?.length || slotVal.enabled !== false,
          id: slotNode.id,
        }
      } else if (val && typeof val === 'object') {
        parsedProps[key] = this.parseProps(val as Props, nodeId, isClone)
      } else {
        parsedProps[key] = val
      }
    })
    return parsedProps
  }

  private createEntity(
    schema: NodeSchema,
    parentId: string | null,
    isClone = false,
  ) {
    const {
      title,
      componentName,
      resourceName,
      props,
      children,
      binding,
      hidden = false,
      locked = false,
    } = schema
    const nodeId = !isClone && schema.id ? schema.id : uniqId('node')
    const realProps = this.parseProps(props, nodeId, isClone)
    const node: NodeEntity = {
      id: nodeId,
      title: title ?? componentName,
      componentName,
      resourceName,
      binding,
      props: realProps,
      parentId,
      documentId: this.ownerDocument.id,
      childIds:
        children?.map(
          (childSchema) =>
            this.ownerDocument.createNode(childSchema, nodeId, isClone).id,
        ) ?? [],
      hidden,
      locked,
    }
    return node
  }

  setHidden(hidden: boolean) {
    this.engine.dispatch(
      nodeEntity.actions.updateOne({ id: this.id, changes: { hidden } }),
    )
  }

  setLocked(locked: boolean) {
    this.engine.dispatch(
      nodeEntity.actions.updateOne({ id: this.id, changes: { locked } }),
    )
  }

  setTitle(title: string) {
    this.engine.dispatch(nodeEntity.actions.setTitle({ id: this.id, title }))
  }

  updateProps(props: Props) {
    this.engine.dispatch(nodeEntity.actions.updateProps({ id: this.id, props }))
    const node = this.ownerDocument.getNodeById(this.id)
    this.engine.dispatchEvent(new NodeUpdateEvent({ node }))
  }

  appendChild(node: INode) {
    this.engine.dispatch(
      nodeEntity.actions.appendChild({
        node: node.toJson(),
        parentId: this.id,
      }),
    )
    this.engine.dispatchEvent(new NodeAddEvent({ node }))
  }

  insertBefore(node: INode, refId: string) {
    this.engine.dispatch(
      nodeEntity.actions.insertBefore({ node: node.toJson(), refId }),
    )
    this.engine.dispatchEvent(new NodeAddEvent({ node }))
  }

  insertAfter(node: INode, refId: string) {
    this.engine.dispatch(
      nodeEntity.actions.insertAfter({ node: node.toJson(), refId }),
    )
    this.engine.dispatchEvent(new NodeAddEvent({ node }))
  }

  remove() {
    if (this.id === this.ownerDocument.activeNode?.id) {
      if (this.parentNode) {
        if (this.parentNode.isSlot) {
          this.ownerDocument.setActiveNodeId(this.parentNode.parentId)
        } else {
          this.ownerDocument.setActiveNodeId(this.parentNode.id)
        }
      } else {
        this.ownerDocument.setActiveNodeId(
          this.ownerDocument.rootNode?.id as string,
        )
      }
    }
    this.engine.dispatch(nodeEntity.actions.remove(this.id))
    this.engine.dispatchEvent(new NodeRemoveEvent({ node: this }))
  }

  clone(mode: 'clone' | 'binding' = 'clone') {
    const schema = this.schema
    if (!schema) return null
    const { id, ...cloneSchema } = schema

    const clonedNode = this.ownerDocument.createNode(cloneSchema, null, true)

    if (mode === 'binding') {
      this.addNodeBindingId(clonedNode.id)
    }
    return clonedNode
  }

  addNodeBindingId(bindingId: string) {
    this.engine.dispatch(
      nodeEntity.actions.addBindingId({ id: this.id, bindingId }),
    )
  }

  removeNodeBindingId(bindingId: string) {
    this.engine.dispatch(
      nodeEntity.actions.removeBindingId({ id: this.id, bindingId }),
    )
  }
}

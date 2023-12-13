import type {
  DragoverTarget,
  NodeSchema,
  CanvasState,
  DraggingTarget,
  JSSlot,
  IDocument,
  IEngine,
  INode,
} from '@lowcode/types'
import { documentEntity, documentState, nodeEntity } from '../store'
import { uniqId, SLOT_COMPONENT } from '@/common'
import { Node } from './Node'

export class Document implements IDocument {
  #id: string
  #rootNode: INode
  #nodeDomMap = new Map<string, HTMLElement>()
  #nodeMap = new Map<string, INode>()

  constructor(private readonly engine: IEngine, schema: NodeSchema) {
    this.#id = uniqId('doc')
    this.#rootNode = this.createNode(schema, null)
    this.setActiveNodeId(this.#rootNode.id)
    this.engine.dispatch(
      documentEntity.actions.addOne({
        id: this.#id,
        title: schema.title,
        rootNodeId: this.#rootNode.id,
        activeNodeId: this.#rootNode.id,
      }),
    )
  }

  get id() {
    return this.#id
  }

  get title() {
    return this.toJson()?.title
  }

  toJson() {
    const document = documentEntity.selectors.selectById(
      this.engine.state,
      this.id,
    )
    return document
  }

  get allNodes() {
    return [...this.#nodeMap.values()]
  }

  get rootNode() {
    return this.#rootNode
  }

  get schema() {
    return this.#rootNode.schema
  }

  get activeNode() {
    return this.getNodeById(this.toJson()?.activeNodeId as string)
  }

  get allNodeIds() {
    return nodeEntity.selectors.selectIdsByDocumentId(this.engine.state, this.id)
  }

  get dragingTarget() {
    return documentState.selectors.selectDragingTarget(this.engine.state)
  }

  get dragoverTarget() {
    return documentState.selectors.selectDragoverTarget(this.engine.state)
  }

  get hoverNodeId() {
    return documentState.selectors.selectHoverNodeId(this.engine.state)
  }

  get canvasState() {
    return documentState.selectors.selectCanvasState(this.engine.state)
  }

  getNodeById(nodeId: string) {
    return this.#nodeMap.get(nodeId)
  }

  getNodeDomById(nodeId: string) {
    return this.#nodeDomMap.get(nodeId)
  }

  setCanvasState(canvasState: CanvasState) {
    return this.engine.dispatch(
      documentState.actions.setCanvasState(canvasState),
    )
  }

  setDraggingTarget(draggingTarget: DraggingTarget | null) {
    return this.engine.dispatch(
      documentState.actions.setDragingTarget(draggingTarget),
    )
  }

  setDragoverTarget(dragoverTarget: DragoverTarget | null) {
    return this.engine.dispatch(
      documentState.actions.setDragoverTarget(dragoverTarget),
    )
  }

  setHoverNodeId(nodeId: string | null) {
    return this.engine.dispatch(documentState.actions.setHoverNodeId(nodeId))
  }

  setRootNodeId(nodeId: string) {
    this.engine.dispatch(
      documentEntity.actions.updateOne({
        id: this.id,
        changes: { rootNodeId: nodeId },
      }),
    )
  }

  setActiveNodeId(nodeId: string | null) {
    this.engine.dispatch(
      documentEntity.actions.setActiveNodeId({
        id: this.id,
        activeNodeId: nodeId,
      }),
    )
    if (nodeId === this.activeNode?.id) {
      this.setHoverNodeId(null)
    }
  }

  setTitle(title: string) {
    return this.engine.dispatch(
      documentEntity.actions.updateOne({
        id: this.id,
        changes: { title },
      }),
    )
  }

  createSlotNode(parentId: string, slotProp: JSSlot, isClone: boolean) {
    const slotNode = this.createNode(
      {
        title: SLOT_COMPONENT,
        props: {},
        componentName: SLOT_COMPONENT,
        children: slotProp.value,
      },
      parentId,
      isClone,
    )
    return slotNode
  }

  createNode(schema: NodeSchema, parentId: string | null, isClone: boolean = false) {
    const node: INode = new Node(schema, parentId, this, this.engine, isClone)
    this.#nodeMap.set(node.id, node)
    return node
  }

  mountNodeById(nodeId: string, dom: HTMLElement) {
    this.#nodeDomMap.set(nodeId, dom)
    const canvasState = this.canvasState
    canvasState && this.setCanvasState({ ...canvasState })
  }

  unmountNodeById(nodeId: string) {
    this.#nodeDomMap.delete(nodeId)
  }

  destroy() {
    this.#nodeDomMap.clear()
    this.#nodeMap.clear()
    this.#rootNode.remove()
    this.engine.dispatch(documentEntity.actions.removeOne(this.id))
  }
}

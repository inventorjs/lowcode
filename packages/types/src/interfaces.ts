import type {
  DocumentEntity,
  NodeEntity,
  ResourceEntity,
  LCTarget,
  DragoverTarget,
  CanvasState,
  DraggingTarget,
  JSSlot,
  BehaviorRule,
  Props,
} from './types'
import type {
  NodeSchema,
  AssetsData,
  ComponentMetaSchema,
  ComponentPropSchema,
  ComponentNestingRuleSchema,
  ComponentSnippetSchema,
  ProjectSchema,
  SetterComponent,
  AssetsSchema,
} from './schemas'

export interface IEngine {
  get shell(): IShell
  get store(): any
  get state(): any
  get project(): IProject
  get materials(): IMaterials
  get plugins(): IPlugins
  get setters(): ISetters
  get config(): IConfig
  get dispatch(): any
  get document(): IDocument | null
  schema(): ProjectSchema
  setSchema(projectSchema: ProjectSchema): void
  registerPlugin(plugin: EnginePluginCls): Promise<void>
  registerSetter(setterName: string, setter: SetterComponent): void
  dispatchEvent: <T = unknown>(event: IEngineEvent<T>) => void
  subscribeEvent: <T, D>(
    E: {
      new (): T
      eventName: string
    },
    handler: (event: D) => void,
  ) => () => void
  destroy(): void
}

export interface IProject {
  get schema(): ProjectSchema
  get activeDocument(): IDocument | null
  get documents(): IDocument[]
  setSchema(projectSchema: ProjectSchema): void
  getDocumentById(documentId: string): IDocument | undefined
  setActiveDocumentId(documentId: string): void
  createDocument(schema: NodeSchema): void
  removeDocumentById(documentId: string): void
  destroy(): void
}

export interface IShell {
  get simulatorGlobal(): Window | null
  createWorkbench(container: HTMLElement): void
  createIframeCanvas(iframeElement: HTMLIFrameElement): void
  destory(): void
}

export interface IEnginePlugin {
  init: () => Promise<void>
  destroy(): void
}

export type EnginePluginCls = {
  new (engine: IEngine): IEnginePlugin
}

export interface IPlugins {
  registerPlugin(plugin: EnginePluginCls): Promise<void>
  destroy(): void
}

export interface ISetters {
  registerSetter(setterName: string, setter: SetterComponent): void
  getSetter(setterName: string): SetterComponent | undefined
  destroy(): void
}

export interface IConfig {
  get(key: string): unknown
  set(key: string, val: unknown): void
}

export interface IEngineEvent<T> {
  eventData: T
}

export interface INode {
  toJson(): NodeEntity
  get title(): string
  get props(): Props
  get componentName(): string
  get resourceName(): string | undefined
  get locked(): boolean
  get hidden(): boolean
  get parentId(): string | null
  get childIds(): string[]
  get meta(): IMeta | undefined
  get behavior(): IBehavior | undefined
  get isSlot(): boolean
  get id(): string
  get schema(): NodeSchema | null
  get ownerDocument(): IDocument
  get parentNode(): INode | undefined
  get ancestorNodes(): INode[]
  get childNodes(): INode[]
  setHidden(hidden: boolean): void
  setLocked(locked: boolean): void
  setTitle(title: string): void
  updateProps(props: Props): void
  appendChild(node: INode): void
  insertBefore(node: INode, refId: string): void
  insertAfter(node: INode, refId: string): void
  remove(): void
  clone(mode?: string): INode | null
  addNodeBindingId(bindingId: string): void
  removeNodeBindingId(bindingId: string): void
}

export interface IDocument {
  get id(): string
  get title(): string | undefined
  toJson(): DocumentEntity | undefined
  get allNodes(): INode[]
  get rootNode(): INode | undefined
  get schema(): NodeSchema | null
  get activeNode(): INode | undefined
  get allNodeIds(): string[]
  get dragingTarget(): LCTarget | null
  get dragoverTarget(): DragoverTarget
  get hoverNodeId(): string | null
  get canvasState(): CanvasState | null
  getNodeById(nodeId: string): INode | undefined
  getNodeDomById(nodeId: string): HTMLElement | undefined
  setCanvasState(canvasState: CanvasState): any
  setDraggingTarget(draggingTarget: DraggingTarget | null): any
  setDragoverTarget(dragoverTarget: DragoverTarget | null): any
  setHoverNodeId(nodeId: string | null): any
  setRootNodeId(nodeId: string): void
  setActiveNodeId(nodeId: string | null): void
  setTitle(title: string): any
  createSlotNode(parentId: string, slotProp: JSSlot, isClone?: boolean): INode
  createNode(
    schema: NodeSchema,
    parentId: string | null,
    isClone?: boolean,
  ): INode
  mountNodeById(nodeId: string, dom: HTMLElement): void
  unmountNodeById(nodeId: string): void
  destroy(): void
}

export interface IMaterials {
  get metaMap(): Map<string, IMeta>
  get resources(): ResourceEntity[]
  get assetsData(): AssetsData | null
  get initialData(): {
    meta: Record<string, ComponentMetaSchema>
    schema: NodeSchema
  } | null
  getResourceById(id: string): ResourceEntity | undefined
  getMetaByName(componentName: string): IMeta | undefined
  getBehaviorByName(componentName: string): IBehavior | undefined
  getPropsSchemaByName(componentName: string): ComponentPropSchema[] | undefined
  getComponentByName(componentName: string): React.FC<Record<string, unknown>>
  loadAssets(asserts: string | AssetsSchema): Promise<void>
  destroy(): void
}

export interface IMeta {
  get schema(): ComponentMetaSchema
  get snippets(): ComponentSnippetSchema[]
  get componentName(): string
  get disableBehaviors(): BehaviorRule[] | undefined
  get configure(): ComponentMetaSchema['configure'] | undefined
  get props(): ComponentPropSchema[]
  get isContainer(): boolean | undefined
  get isModal(): boolean | undefined
  get nestingRule(): ComponentNestingRuleSchema | undefined
  get onNodeAdd(): ((node: INode, engine: IEngine) => void) | undefined
  get onNodeRemove(): ((node: INode, engine: IEngine) => void) | undefined
}

export interface IBehavior {
  canDrop(
    fromMeta: IMeta,
    siblingMetaList?: IMeta[],
    ancestorMetaList?: IMeta[],
  ): boolean
  canMove(): boolean
  canCopy(): boolean
  canRemove(): boolean
  canHover(): boolean
  canSelect(): boolean
}

export interface IAssets {
  getAssets(): AssetsSchema | null
  buildComponents(global: Window | null): Record<string, unknown>
  loadAssets(
    assets: string | AssetsSchema,
    global: Window | null,
  ): Promise<AssetsData>
}

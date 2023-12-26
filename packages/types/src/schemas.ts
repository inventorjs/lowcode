import type { IEngine, INode } from './interfaces'
import type { TitleContent, Props, BehaviorRule } from './types'

export interface ProjectSchema {
  version: string
  componentsTree: NodeSchema[]
}

export interface NodeSchema {
  id?: string
  title: string
  componentName: string
  resourceName?: string
  children?: NodeSchema[]
  props: Props
  hidden?: boolean
  locked?: boolean
  selfRender?: boolean
  binding?: {
    ids?: string[]
    toId?: string
  }
}

export interface ComponentMetaSchema {
  componentName: string
  title: TitleContent
  props: ComponentPropSchema[]
  snippets: ComponentSnippetSchema[]
  configure?: {
    component?: {
      isContainer?: boolean
      isModal?: boolean
      disableBehaviors?: BehaviorRule[]
      nestingRule?: ComponentNestingRuleSchema
    }
    advanced?: {
      callbacks?: {
        onNodeAdd?: (node: INode, engine: IEngine) => void
        onNodeRemove?: (node: INode, engine: IEngine) => void
      }
    }
  }
}

export interface ComponentNestingRuleSchema {
  childWhiteList?: string[]
  parentWhiteList?: string[]
  siblingWhiteList?: string[]
  ancestorBlackList?: string[]
}

export interface ComponentPropSchema {
  name: string
  display?: 'inline' | 'block'
  disabled?: boolean
  title: TitleContent
  defaultValue?: unknown
  condition?: (node: INode) => boolean
  setter: SetterType | SetterType[]
}

export interface ComponentSnippetSchema {
  title: string
  screenshot?: string
  schema: Omit<NodeSchema, 'title'>
}

export interface ComponentResource extends ComponentSnippetSchema {
  id: string
}

export interface AssetsSortSchema {
  categoryList: {
    name: string
    components: string[]
  }[]
}

export interface AssetsSchema {
  packages: {
    package: string
    version: string
    library: string
    urls: string[]
    editUrls: string[]
  }[]
  components: {
    npm: {
      package: string
      version: string
    }
    exportName: string
    url: string
  }[]
  sort: AssetsSortSchema
}

export interface AssetsData {
  editCssList: string[]
  editJsList: string[]
  cssList: string[]
  jsList: string[]
  sort: AssetsSortSchema
}

export interface MaterialExt {
  getInitialData: (meta: Record<string, ComponentMetaSchema>) => Promise<{
    meta: Record<string, ComponentMetaSchema>
    schema: NodeSchema
    setters: Record<string, unknown>
  }>
}

export interface SetterConfig {
  componentName: string
  props: Record<string, unknown>
  defaultValue?: unknown
  initialValue?: unknown
}

export type SetterType = SetterConfig | string
export type SetterComponent = (props: SetterProps) => any

export interface SetterProps<T = unknown, R = unknown> {
  value: T
  disabled?: boolean
  onChange: (v: T) => void
  renderField: (p: SetterProps<T, R>) => R
  [k: string]: unknown
}

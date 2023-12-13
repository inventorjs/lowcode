import type { ComponentMetaSchema, IMeta } from '@lowcode/types';

export class Meta implements IMeta {
  constructor(private readonly componentMeta: ComponentMetaSchema) {}

  get schema() {
    return this.componentMeta
  }

  get snippets() {
    return this.componentMeta.snippets
  }

  get componentName() {
    return this.componentMeta.componentName
  }

  get disableBehaviors() {
    return this.configure?.component?.disableBehaviors
  }

  get configure() {
    return this.componentMeta.configure
  }

  get props() {
    return this.componentMeta.props
  }

  get isContainer() {
    return this.configure?.component?.isContainer
  }

  get isModal() {
    return this.configure?.component?.isModal
  }

  get nestingRule() {
    return this.configure?.component?.nestingRule
  }

  get onNodeAdd() {
    return this.configure?.advanced?.callbacks?.onNodeAdd
  }

  get onNodeRemove() {
    return this.configure?.advanced?.callbacks?.onNodeRemove
  }
}

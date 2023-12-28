import type { IEngine, IEnginePlugin } from '@lowcode/types'

export class InitSchemaPlugin implements IEnginePlugin {
  constructor(private readonly engine: IEngine) {}

  async init() {
    try {
      const projectSchema = localStorage.getItem('lc-schema')
      if (!projectSchema) {
        throw new Error('projectSchema is empty.')
      }
      this.engine.setSchema(JSON.parse(projectSchema))
    } catch (err) {
      console.warn(err)
      if (this.engine.materials.initialData) {
        const { schema } = this.engine.materials.initialData
        this.engine.setSchema({
          version: '1.0.0',
          componentsTree: [schema],
        })
      }
    }
  }

  destroy(): void {}
}

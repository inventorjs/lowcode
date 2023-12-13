import type {
  IDocument,
  IEngine,
  IProject,
  NodeSchema,
  ProjectSchema,
} from '@lowcode/types'
import { Document } from './document'
import { projectState } from './store'

export class Project implements IProject {
  #activeDocument: IDocument | null = null
  #documentMap = new Map<string, IDocument>()
  #version: string = '1.0.0'

  constructor(private readonly engine: IEngine) {}

  get schema() {
    return {
      version: this.#version,
      componentsTree: this.documents
        .map((document) => document.schema)
        .filter((schema) => !!schema) as NodeSchema[],
    }
  }

  get activeDocument() {
    return this.#activeDocument
  }

  get documents() {
    return [...this.#documentMap.values()]
  }

  setSchema(projectSchema: ProjectSchema) {
    this.#version = projectSchema.version
    projectSchema.componentsTree.forEach((schema) =>
      this.createDocument(schema),
    )
    this.setActiveDocumentId([...this.#documentMap.keys()][0])
  }

  getDocumentById(documentId: string) {
    return this.#documentMap.get(documentId)
  }

  setActiveDocumentId(documentId: string) {
    const document = this.#documentMap.get(documentId)
    if (document) {
      this.#activeDocument = document
      this.engine.dispatch(projectState.actions.setActiveDocumentId(documentId))
    }
  }

  createDocument(schema: NodeSchema) {
    const document = new Document(this.engine, schema)
    this.#documentMap.set(document.id, document)
  }

  removeDocumentById(documentId: string) {
    const document = this.getDocumentById(documentId)
    if (document) {
      document.destroy()
      if (document === this.#activeDocument) {
        const firstDocumentId = [...this.#documentMap.keys()][0]
        if (firstDocumentId) {
          this.setActiveDocumentId(firstDocumentId)
        }
      }
    }
  }

  destroy() {}
}

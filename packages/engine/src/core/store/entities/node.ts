/**
 * nodes entity
 */
import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
  type EntityState,
} from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { isJSSlot } from '@/common'
import { type RootState } from '..'
import type { JSSlot, Props, NodeEntity } from '@lowcode/types'

const adapter = createEntityAdapter<NodeEntity>()

function insert(
  state: EntityState<NodeEntity>,
  payload: { refId: string; node: NodeEntity },
  location: 'before' | 'after',
) {
  const {
    node: { childNodes, ...insertNode },
    refId,
  } = payload
  const refNode = state.entities[refId]
  if (!refNode || !refNode.parentId) return

  const { parentId } = insertNode
  const refParentNode = state.entities[refNode.parentId]
  if (!refParentNode) return

  const refIndex = refParentNode.childIds?.findIndex(
    (childId) => childId === refId,
  )
  if (refIndex < 0) return

  if (state.entities[insertNode.id]) {
    const parentNode = parentId ? state.entities[parentId] : null
    if (parentNode) {
      parentNode.childIds = parentNode.childIds.filter(
        (childId) => childId !== insertNode.id,
      )
    }
    adapter.updateOne(state, {
      id: insertNode.id,
      changes: { ...insertNode, parentId: refNode.parentId },
    })
  } else {
    adapter.addOne(state, {
      ...insertNode,
      parentId: refNode.parentId,
    })
  }
  const targetIndex = location === 'before' ? refIndex : refIndex + 1
  refParentNode.childIds.splice(targetIndex, 0, insertNode.id)

  if (childNodes) {
    adapter.addMany(state, childNodes)
  }
}

function remove(state: EntityState<NodeEntity>, nodeId: string) {
  const parentId = state.entities[nodeId]?.parentId
  const childIds = state.entities[nodeId]?.childIds ?? []
  const props = state.entities[nodeId]?.props ?? {}

  Object.values(props).forEach((propValue) => {
    const slotPropValue = propValue as JSSlot
    if (isJSSlot(slotPropValue) && slotPropValue?.id) {
      remove(state, slotPropValue.id)
    }
  })

  if (parentId) {
    const parentNode = state.entities[parentId]
    if (parentNode) {
      parentNode.childIds = parentNode.childIds.filter(
        (childId) => childId !== nodeId,
      )
    }
  }
  if (childIds?.length > 0) {
    childIds.forEach((childId) => remove(state, childId))
    adapter.removeMany(state, childIds)
  }
  adapter.removeOne(state, nodeId)
}

function mergeProps(props: Props, changes: Record<string, unknown>) {
  if (!changes || typeof changes !== 'object') return

  Object.keys(changes).forEach((key) => {
    if (
      props[key] &&
      changes[key] &&
      typeof changes[key] === 'object' &&
      !Array.isArray(changes[key])
    ) {
      if (typeof props[key] !== 'object') {
        props[key] = {}
      }
      mergeProps(props[key] as Props, changes[key] as Record<string, unknown>)
    } else {
      props[key] = changes[key]
    }
  })
}

function removeBindingId(
  state: EntityState<NodeEntity>,
  payload: { id: string; bindingId: string },
) {
  const { id, bindingId } = payload
  const nodeEntity = state.entities[id]
  const bindingNodeEntity = state.entities[bindingId]
  if (!nodeEntity || !bindingNodeEntity) return
  const binding = nodeEntity.binding ?? {}
  const bindingTo = bindingNodeEntity.binding ?? {}
  let bindingIds = binding?.ids ?? []
  bindingIds = bindingIds.filter((bid) => bid !== bindingId)
  nodeEntity.binding = Object.assign(binding, {
    ids: bindingIds,
  })
  delete bindingTo.toId
}

export const name = 'node'
const slice = createSlice({
  name,
  initialState: adapter.getInitialState(),
  reducers: {
    remove(state: EntityState<NodeEntity>, action: PayloadAction<string>) {
      const { payload: nodeId } = action
      remove(state, nodeId)
    },

    appendChild(
      state: EntityState<NodeEntity>,
      action: PayloadAction<{ node: NodeEntity; parentId: string | null }>,
    ) {
      const { payload } = action
      const {
        node: { childNodes, ...node },
        parentId,
      } = payload

      const parentNode = node.parentId ? state.entities[node.parentId] : null
      const insertNode = state.entities[node.id]

      if (parentId) {
        state.entities[parentId]?.childIds.push(node.id)
      }
      if (parentNode) {
        parentNode.childIds = parentNode.childIds.filter(
          (childId) => node.id !== childId,
        )
      }
      if (insertNode) {
        insertNode.parentId = parentId ?? null
      } else {
        adapter.addOne(state, { ...node, parentId: parentId ?? null })
        if (childNodes) {
          adapter.addMany(state, childNodes)
        }
      }
    },

    insertBefore(
      state: EntityState<NodeEntity>,
      action: PayloadAction<{
        node: NodeEntity
        refId: string
      }>,
    ) {
      insert(state, action.payload, 'before')
    },

    insertAfter(
      state: EntityState<NodeEntity>,
      action: PayloadAction<{
        node: NodeEntity
        refId: string
      }>,
    ) {
      insert(state, action.payload, 'after')
    },

    updateProps(
      state: EntityState<NodeEntity>,
      action: PayloadAction<{
        id: string
        props: Record<string, unknown>
      }>,
    ) {
      const { id, props } = action.payload
      const node = state.entities[id]
      if (!node) return
      mergeProps(node.props, props)

      const binding = node.binding ?? {}
      if (binding) {
        const bindingIds = binding?.ids ?? []
        const bindingToId = binding?.toId as string
        bindingIds.forEach((bindingId) => {
          const bindingNode = state.entities[bindingId]
          if (!bindingNode) return
          mergeProps(bindingNode.props, props)
        })
        removeBindingId(state, { id: bindingToId, bindingId: id })
      }
    },

    appendSlot(
      state: EntityState<NodeEntity>,
      action: PayloadAction<NodeEntity>,
    ) {
      const { payload } = action
      const { childNodes, ...node } = payload
      adapter.addOne(state, node)

      if (childNodes) {
        adapter.addMany(state, childNodes)
      }
    },

    setTitle(
      state: EntityState<NodeEntity>,
      action: PayloadAction<{
        id: string
        title: string
      }>,
    ) {
      const {
        payload: { id, title },
      } = action
      adapter.updateOne(state, { id, changes: { title } })
    },

    addBindingId(
      state: EntityState<NodeEntity>,
      action: PayloadAction<{
        id: string
        bindingId: string
      }>,
    ) {
      const { id, bindingId } = action.payload
      const nodeEntity = state.entities[id]

      if (!nodeEntity) return
      const binding = nodeEntity.binding ?? {}
      const bindingIds = binding?.ids ?? []
      bindingIds.push(bindingId)
      nodeEntity.binding = Object.assign(binding, {
        ids: bindingIds,
      })
    },

    removeBindingId(
      state: EntityState<NodeEntity>,
      action: PayloadAction<{
        id: string
        bindingId: string
      }>,
    ) {
      removeBindingId(state, action.payload)
    },

    updateOne(
      state: EntityState<NodeEntity>,
      action: PayloadAction<{ id: string; changes: Partial<NodeEntity> }>,
    ) {
      const { payload } = action
      adapter.updateOne(state, payload)
    },
  },
})

const entitySelectors = adapter.getSelectors(
  (state: RootState) => state.entities[name],
)

const selectAncestorById = createSelector(
  [(state: RootState) => state.entities.node, (_: RootState, id: string) => id],
  (nodeEntity: EntityState<NodeEntity>, id: string) => {
    let node = nodeEntity.entities[id]
    const ancestor: NodeEntity[] = []
    while (node?.parentId) {
      node = nodeEntity.entities[node.parentId]
      if (node && node?.componentName !== 'Slot') {
        ancestor.push(node)
      }
    }
    return ancestor
  },
)

const selectAllByDocumentId = createSelector(
  [
    (state: RootState) => state.entities.node,
    (_: RootState, documentId: string) => documentId,
  ],
  (nodeEntity: EntityState<NodeEntity>, documentId: string) => {
    const allNodes = Object.values(nodeEntity.entities).filter(
      (node) => node?.documentId === documentId,
    )
    return allNodes as NodeEntity[]
  },
)

const selectIdsByDocumentId = createSelector(
  [
    (state: RootState) => state.entities.node,
    (_: RootState, documentId: string) => documentId,
  ],
  (nodeEntity: EntityState<NodeEntity>, documentId: string) => {
    const ids = Object.values(nodeEntity.entities)
      .filter((node) => node?.documentId === documentId)
      .map((node) => node?.id)
    return ids as string[]
  },
)

export const reducer = slice.reducer
export const actions = slice.actions
export const selectors = {
  selectById: (state: RootState, id: string) =>
    entitySelectors.selectById(state, id),
  selectAll: (state: RootState) => entitySelectors.selectAll(state),
  selectIds: (state: RootState) => entitySelectors.selectIds(state),
  selectAncestorById,
  selectAllByDocumentId,
  selectIdsByDocumentId,
}

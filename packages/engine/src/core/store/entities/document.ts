/**
 * documents entity
 */
import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
  type EntityState,
} from '@reduxjs/toolkit'
import type { DocumentEntity } from '@lowcode/types'
import { type RootState } from '..'

const adapter = createEntityAdapter<DocumentEntity>({})
const initialState = adapter.getInitialState()

export const name = 'document'
const slice = createSlice({
  name,
  initialState,
  reducers: {
    addOne(
      state: EntityState<DocumentEntity>,
      action: PayloadAction<DocumentEntity>,
    ) {
      adapter.addOne(state, action.payload)
    },
    updateOne(
      state: EntityState<DocumentEntity>,
      action: PayloadAction<{ id: string; changes: Partial<DocumentEntity> }>,
    ) {
      const { payload } = action
      adapter.updateOne(state, payload)
    },
    removeOne(
      state: EntityState<DocumentEntity>,
      action: PayloadAction<string>,
    ) {
      adapter.removeOne(state, action.payload)
    },
    setActiveNodeId(
      state: EntityState<DocumentEntity>,
      action: PayloadAction<{ id: string; activeNodeId: string | null }>,
    ) {
      const {
        payload: { id, activeNodeId },
      } = action
      adapter.updateOne(state, { id, changes: { activeNodeId } })
    },
  },
})

const entitySelectors = adapter.getSelectors(
  (state: RootState) => state.entities[name],
)

export const reducer = slice.reducer
export const actions = slice.actions
export const selectors = {
  selectById: (state: RootState, id: string) =>
    entitySelectors.selectById(state, id),
}

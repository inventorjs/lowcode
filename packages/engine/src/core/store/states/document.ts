/**
 * document ui
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '..'
import type {
  DragoverTarget,
  CanvasState,
  DraggingTarget,
} from '@lowcode/types'

export interface DocumentState {
  hoverNodeId: string | null
  draggingTarget: DraggingTarget | null
  dragoverTarget: DragoverTarget | null
  canvasState: CanvasState | null
}

const initialState: DocumentState = {
  hoverNodeId: null,
  draggingTarget: null,
  dragoverTarget: null,
  canvasState: null,
}

export const name = 'documentState'
const slice = createSlice({
  name,
  initialState,
  reducers: {
    setDragingTarget(
      state: DocumentState,
      { payload: draggingTarget }: PayloadAction<DraggingTarget | null>,
    ) {
      state.draggingTarget = draggingTarget
    },
    setHoverNodeId(
      state: DocumentState,
      { payload: hoverNodeId }: PayloadAction<string | null>,
    ) {
      state.hoverNodeId = hoverNodeId
    },
    setDragoverTarget(
      state: DocumentState,
      { payload: dragoverTarget }: PayloadAction<DragoverTarget | null>,
    ) {
      state.dragoverTarget = dragoverTarget
    },
    setCanvasState(
      state: DocumentState,
      { payload: canvasState }: PayloadAction<CanvasState>,
    ) {
      state.canvasState = canvasState
    },
  },
})

export const reducer = slice.reducer
export const actions = { ...slice.actions }
export const selectors = {
  selectState: (state: RootState) => state.state.documentState,
  selectDragingTarget: (state: RootState) =>
    state.state.documentState.draggingTarget,
  selectDragoverTarget: (state: RootState) =>
    state.state.documentState.dragoverTarget,
  selectHoverNodeId: (state: RootState) => state.state.documentState.hoverNodeId,
  selectCanvasState: (state: RootState) =>
    state.state.documentState.canvasState,
}

import type { AssetsData } from '@lowcode/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '..'

export interface ProjectState {
  id: string
  title: string
  settings: unknown
  activeDocumentId: string | null
  assetsData: AssetsData | null
}

const initialState: ProjectState = {
  id: '',
  title: '',
  settings: {},
  activeDocumentId: null,
  assetsData: null,
}

export const name = 'projectState'
const slice = createSlice({
  name,
  initialState,
  reducers: {
    setActiveDocumentId(state: ProjectState, action: PayloadAction<string>) {
      state.activeDocumentId = action.payload
    },
    setAssertsData(state: ProjectState, action: PayloadAction<AssetsData>) {
      state.assetsData = action.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
export const selectors = {
  selectState: (state: RootState) => state.state.projectState,
  selectActiveDocumentId: (state: RootState) =>
    state.state.projectState.activeDocumentId,
  selectAssetsData: (state: RootState) => state.state.projectState.assetsData,
}

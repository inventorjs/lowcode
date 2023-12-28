import type { AssetsData, DataSourceSchema } from '@lowcode/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '..'

export interface ProjectState {
  id: string
  title: string
  settings: unknown
  activeDocumentId: string | null
  assetsData: AssetsData | null
  dataSources: DataSourceSchema[]
}

const initialState: ProjectState = {
  id: '',
  title: '',
  settings: {},
  activeDocumentId: null,
  assetsData: null,
  dataSources: [],
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
    setDataSources(
      state: ProjectState,
      action: PayloadAction<DataSourceSchema[]>,
    ) {
      state.dataSources = action.payload
    },
    addDataSource(
      state: ProjectState,
      action: PayloadAction<DataSourceSchema>,
    ) {
      state.dataSources.push(action.payload)
    },
    updateDataSource(
      state: ProjectState,
      action: PayloadAction<{ id: string; changes: Partial<DataSourceSchema> }>,
    ) {
      const { id, changes } = action.payload
      const index = state.dataSources.findIndex((item) => id === item.id)
      if (index > -1) {
        state.dataSources[index] = {
          ...state.dataSources[index],
          ...changes,
        }
      }
    },
    removeDataSource(state: ProjectState, action: PayloadAction<string>) {
      state.dataSources = state.dataSources.filter(
        (item) => action.payload !== item.id,
      )
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
  selectDataSources: (state: RootState) => state.state.projectState.dataSources,
}

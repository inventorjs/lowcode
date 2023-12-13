import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '..'
import type { CanvasSetting, PreviewSetting } from '@/types'

export interface ProjectState {
  outlinePanel: {
    expandedKeys: string[] | null
  }
  canvasSetting: CanvasSetting
  previewSetting: {
    open: boolean
  }
}

const initialState: ProjectState = {
  outlinePanel: {
    expandedKeys: null,
  },
  canvasSetting: {
    width: 'auto',
  },
  previewSetting: {
    open: false,
  },
}

export const name = 'projectUI'
const slice = createSlice({
  name,
  initialState,
  reducers: {
    setOutlineExpandedKeys(
      state: ProjectState,
      action: PayloadAction<string[]>,
    ) {
      state.outlinePanel.expandedKeys = action.payload
    },
    updateCanvasSetting(
      state: ProjectState,
      action: PayloadAction<Partial<CanvasSetting>>,
    ) {
      Object.assign(state.canvasSetting, action.payload)
    },
    updatePreviewSetting(
      state: ProjectState,
      action: PayloadAction<Partial<PreviewSetting>>,
    ) {
      Object.assign(state.previewSetting, action.payload)
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
export const selectors = {
  selectState: (state: RootState) => state.ext.projectUI,
  selectOutlineExpandedKeys: (state: RootState) =>
    state.ext.projectUI.outlinePanel.expandedKeys,
  selectCanvasSetting: (state: RootState) => state.ext.projectUI.canvasSetting,
  selectPreviewSetting: (state: RootState) =>
    state.ext.projectUI.previewSetting,
}

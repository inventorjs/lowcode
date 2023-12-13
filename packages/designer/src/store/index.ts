import { combineReducers } from '@reduxjs/toolkit'
import * as projectState from './states/project'
import { type ProjectState } from './states/project'
import { type RootState as EngineRootState } from '@lowcode/engine'

export const reducer = combineReducers({
  [projectState.name]: projectState.reducer,
})

export type RootState = Omit<EngineRootState, 'ext'> & {
  ext: {
    [projectState.name]: ProjectState
  }
}

export { projectState }

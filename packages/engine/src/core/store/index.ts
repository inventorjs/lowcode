/**
 * store
 */
import { configureStore, combineReducers, type Reducer } from '@reduxjs/toolkit'
import * as documentEntity from './entities/document'
import * as nodeEntity from './entities/node'
import * as resourceEntity from './entities/resource'
import * as documentState from './states/document'
import * as projectState from './states/project'

export function configStore(reducer: Reducer) {
  const store = configureStore({
    reducer: {
      entities: combineReducers({
        [documentEntity.name]: documentEntity.reducer,
        [nodeEntity.name]: nodeEntity.reducer,
        [resourceEntity.name]: resourceEntity.reducer,
      }),
      state: combineReducers({
        [documentState.name]: documentState.reducer,
        [projectState.name]: projectState.reducer,
      }),
      ext: reducer,
    },
  })
  return store
}

export type RootState = ReturnType<ReturnType<typeof configStore>['getState']>
export type { Reducer }

export {
  documentEntity,
  nodeEntity,
  resourceEntity,
  documentState,
  projectState,
}

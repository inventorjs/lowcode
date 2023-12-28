import { useSelector } from 'react-redux'
import { useEngine } from './useEngine'

export function useDataSources() {
  const { engine } = useEngine()
  const dataSources = useSelector(() => engine.project.dataSources)

  const addDataSource = (
    ...args: Parameters<typeof engine.project.addDataSource>
  ) => engine.project.addDataSource(...args)
  const updateDataSource = (
    ...args: Parameters<typeof engine.project.updateDataSourceById>
  ) => engine.project.updateDataSourceById(...args)
  const removeDataSource = (
    ...args: Parameters<typeof engine.project.removeDataSourceById>
  ) => engine.project.removeDataSourceById(...args)

  return { dataSources, updateDataSource, addDataSource, removeDataSource }
}

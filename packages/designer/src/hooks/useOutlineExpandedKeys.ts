import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { projectState } from '../store'
import { useAllNodeIds } from '@lowcode/engine'

export function useOutlineExpandedKeys() {
  const dispatch = useDispatch()
  const expandedKeys = useSelector(
    projectState.selectors.selectOutlineExpandedKeys,
  )
  const { allNodeIds } = useAllNodeIds()

  useEffect(() => {
    if (!expandedKeys && allNodeIds?.length) {
      dispatch(projectState.actions.setOutlineExpandedKeys(allNodeIds as string[]))
    }
  }, [dispatch, expandedKeys, allNodeIds])

  const setExpandedKeys = (expandedKeys: string[]) =>
    dispatch(projectState.actions.setOutlineExpandedKeys(expandedKeys))

  return {
    expandedKeys,
    setExpandedKeys,
  }
}

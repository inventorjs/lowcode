import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { projectState } from '@/store'
import type { CanvasSetting } from '@/types'

export function useCanvasSetting() {
  const dispatch = useDispatch()
  const canvasSetting = useSelector(projectState.selectors.selectCanvasSetting)

  const updateCanvasSetting = useCallback(
    (setting: CanvasSetting) =>
      dispatch(projectState.actions.updateCanvasSetting(setting)),
    [dispatch],
  )

  return { canvasSetting, updateCanvasSetting }
}

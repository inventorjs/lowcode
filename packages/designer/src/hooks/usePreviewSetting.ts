import type { PreviewSetting } from '@/types'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { projectState } from '../store'

export function usePreviewSetting() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const previewSetting = useSelector(
    projectState.selectors.selectPreviewSetting,
  )

  const updatePreviewSetting = useCallback(
    (setting: PreviewSetting) =>
      dispatch(projectState.actions.updatePreviewSetting(setting)),
    [dispatch],
  )

  return { previewSetting, updatePreviewSetting, isLoading, setIsLoading }
}

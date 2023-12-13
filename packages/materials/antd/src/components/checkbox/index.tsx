import { forwardRef } from 'react'
import { Checkbox as AntdCheckbox } from 'antd'

export const Checkbox = forwardRef<HTMLLabelElement, any>(function Checkbox(
  props,
  ref,
) {
  const { children } = props
  return (
    <AntdCheckbox {...props} ref={ref}>
      {children}
    </AntdCheckbox>
  )
})

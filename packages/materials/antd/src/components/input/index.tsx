import { forwardRef } from 'react'
import { Input as AntdInput } from 'antd'

export const Input = forwardRef<HTMLLabelElement, any>(function Input(
  props,
  ref,
) {
  return <AntdInput {...props} ref={ref} />
})

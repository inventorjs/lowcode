import type { SetterProps } from '@lowcode/types'
import { InputNumber } from 'antd'

export function NumberSetter({ value, disabled, onChange }: SetterProps<number>) {
  return (
    <InputNumber
      type="number"
      disabled={disabled}
      value={value}
      size="small"
      onChange={(value) => onChange(value as number)}
    />
  )
}

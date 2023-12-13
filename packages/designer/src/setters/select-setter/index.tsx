import { Select } from 'antd'
import type { SetterProps } from '@lowcode/types'

export interface SelectSetterProps extends SetterProps<unknown> {
  options: Array<{ value: unknown; label: string }>
}

export function SelectSetter({ value, disabled, onChange, options }: SelectSetterProps) {
  return (
    <Select
      value={value}
      disabled={disabled}
      options={options}
      size="small"
      onChange={(value) => onChange(value)}
    />
  )
}

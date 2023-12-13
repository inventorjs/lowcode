import type { SetterProps } from '@lowcode/types'
import { Input } from 'antd'

export function StringSetter({ disabled, value, onChange }: SetterProps<string>) {
  return (
    <Input
      size="small"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

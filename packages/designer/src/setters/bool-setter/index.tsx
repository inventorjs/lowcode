import type { SetterProps } from '@lowcode/types'
import { Switch } from 'antd'

export function BoolSetter({
  value,
  disabled,
  onChange,
}: SetterProps<boolean>) {
  return (
    <Switch
      checked={value}
      disabled={disabled}
      size="small"
      onChange={onChange}
    />
  )
}

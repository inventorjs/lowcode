import { Switch } from 'antd'
import type { SetterProps, JSSlot } from '@lowcode/types'

export function SlotSetter({ value, disabled, onChange }: SetterProps<JSSlot>) {
  if (!value) return null

  const handleChange = (checked: boolean) => {
    onChange({ ...value, enabled: checked })
  }

  return (
    <Switch
      disabled={disabled}
      checked={value?.enabled}
      size="small"
      onChange={handleChange}
    />
  )
}

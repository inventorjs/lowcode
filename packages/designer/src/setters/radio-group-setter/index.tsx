import { Radio } from 'antd'
import type { SetterProps } from '@lowcode/types'

export interface RadioGroupSetterProps extends SetterProps<unknown> {
  options: Array<{ value: string | number | boolean; label: string }>
}

export function RadioGroupSetter({
  value,
  disabled,
  onChange,
  options,
}: RadioGroupSetterProps) {
  return (
    <Radio.Group
      value={value}
      options={options}
      disabled={disabled}
      size="small"
      optionType="button"
      onChange={(evt) => onChange(evt.target.value)}
    />
  )
}

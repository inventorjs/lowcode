import type { SetterProps, JSExpression } from '@lowcode/types'
import { Input } from 'antd'

export function ExpressionSetter({
  value,
  disabled,
  onChange,
}: SetterProps<JSExpression | null>) {
  return (
    <Input
      value={value?.value}
      disabled={disabled}
      size="small"
      onChange={(e) =>
        onChange({ type: 'JSExpression', value: e.target.value })
      }
    />
  )
}

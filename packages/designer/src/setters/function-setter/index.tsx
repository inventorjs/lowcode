import { Input, Button, Popover } from 'antd'
import type { SetterProps, JSFunction } from '@lowcode/types'

export function FunctionSetter({
  value,
  disabled,
  onChange,
}: SetterProps<JSFunction | null>) {
  return (
    <Popover
      title="函数代码"
      placement='right'
      trigger="click"
      content={
        <Input.TextArea
          value={value?.value}
          disabled={disabled}
          onChange={(e) =>
            onChange({ type: 'JSFunction', value: e.target.value })
          }
        />
      }
    >
      <Button size='small' block>编辑代码</Button>
    </Popover>
  )
}

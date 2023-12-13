import { Popover } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { SetterProps, ComponentPropSchema } from '@lowcode/types'

export interface ObjectSetterProps
  extends SetterProps<Record<string, unknown>, React.ReactNode> {
  config: {
    items: ComponentPropSchema[]
  }
  forceInline?: number
}

function FormSetter({
  config: { items },
  value,
  disabled,
  onChange,
  renderField,
}: ObjectSetterProps) {
  return (
    <>
      {items.map((item) =>
        renderField({
          key: item.name,
          schema: item,
          disabled,
          value: value?.[item.name] as ObjectSetterProps['value'],
          renderField,
          onChange,
        }),
      )}
    </>
  )
}

function RowSetter(props: ObjectSetterProps) {
  const {
    config: { items },
    value,
    onChange,
    renderField,
  } = props
  const inlineItems = items.slice(0, 2)
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {items.length > 2 && (
        <Popover
          trigger="click"
          placement="left"
          title="编辑数据"
          content={<FormSetter {...props} />}
        >
          <EditOutlined />
        </Popover>
      )}
      {inlineItems.map((item) =>
        renderField({
          key: item.name,
          schema: { ...item, title: '' },
          style: { marginBottom: 0, marginLeft: 4, marginRight: 4 },
          value: value?.[item.name] as ObjectSetterProps['value'],
          renderField,
          onChange,
        }),
      )}
    </div>
  )
}

export function ObjectSetter(props: ObjectSetterProps) {
  const { config, forceInline = 0 } = props
  const { items } = config
  if (!items.length) return null

  if (forceInline) {
    return <RowSetter {...props} />
  }

  return <FormSetter {...props} />
}

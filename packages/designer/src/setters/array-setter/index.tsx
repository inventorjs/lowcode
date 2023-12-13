import type { SetterProps, SetterType } from '@lowcode/types'
import { Form } from 'antd'
import { DeleteOutlined, DragOutlined } from '@ant-design/icons'

export function ArraySetter({
  itemSetter,
  value,
  renderField,
  disabled,
  onChange,
}: SetterProps<unknown | unknown[], React.ReactNode>) {
  const setter = itemSetter as SetterType
  const valueArr = value as unknown[]

  return (
    <Form labelCol={{ span: 0 }} colon={false} component={false}>
      {valueArr?.map((v, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {renderField({
            schema: {
              name: String(index),
              setter,
            },
            style: { marginBottom: 2 },
            value: v,
            renderField,
            disabled,
            onChange,
          })}
          <DragOutlined
            style={{ marginLeft: 6 }}
            onClick={() => onChange(valueArr.filter((_, idx) => index !== idx))}
          />
          <DeleteOutlined
            style={{ marginLeft: 6 }}
            onClick={() => onChange(valueArr.filter((_, idx) => index !== idx))}
          />
        </div>
      ))}
      <a
        onClick={() => {
          const initialValue =
            typeof setter === 'string' ? null : setter?.initialValue ?? null
          if (!valueArr?.length) {
            onChange([initialValue])
          } else {
            onChange({ [valueArr.length]: initialValue })
          }
        }}
      >
        添加一项
      </a>
    </Form>
  )
}

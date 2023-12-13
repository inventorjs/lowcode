import { type CSSProperties } from 'react'
import { Dropdown, Form, Layout, Tabs, Tooltip, Typography } from 'antd'
import {
  useActiveNode,
  useNodePropsById,
  useSetterComponentByName,
  useSetterField,
} from '@lowcode/engine'
import type { ComponentPropSchema, SetterType } from '@lowcode/types'
import { SwitchIcon } from '@/components/icons'

function SetterSwitcher({
  setterName,
  options,
  onChange,
}: {
  setterName: string
  options: Array<{
    label: string
    value: string
    setter: SetterType
  }> | null
  onChange: (v: SetterType) => void
}) {
  return (
    <>
      {!!options?.length && (
        <Dropdown
          menu={{
            selectedKeys: [setterName],
            items: options?.map((item) => ({
              key: item.value,
              label: item.label,
              onClick: () => onChange(item.setter),
            })),
          }}
        >
          <div>
            <SwitchIcon
              style={{
                fontSize: 20,
                marginLeft: 10,
              }}
            />
          </div>
        </Dropdown>
      )}
    </>
  )
}

function renderField(props: {
  key: string
  schema: ComponentPropSchema
  value: unknown
  style?: CSSProperties
  onChange: (v: Record<string, unknown>) => void
}) {
  return <SetterField {...props} />
}

export function SetterField({
  schema,
  value,
  style = { marginBottom: 8 },
  onChange,
}: {
  schema: ComponentPropSchema
  value: unknown
  style?: CSSProperties
  onChange: (v: Record<string, unknown>) => void
}) {
  const {
    name,
    title,
    display,
    disabled,
    visible,
    setterName,
    setterProps,
    setterOptions,
    setActiveSetter,
  } = useSetterField({
    schema,
    value,
    onChange,
  })

  const { SetterComponent } = useSetterComponentByName(setterName)

  if (!visible) return null
  if (!SetterComponent) return <div>Setter未注册({setterName})</div>

  const formItem = (
    <Form.Item
      label={
        <>
          {typeof title === 'string' ? (
            <span className="break-all">{title}</span>
          ) : (
            <Tooltip title={title?.tip}>
              <span className="break-all">{title?.label}</span>
            </Tooltip>
          )}
        </>
      }
      style={style}
    >
      <div
        style={{
          display: setterOptions?.length ? 'flex' : 'block',
          justifyContent: 'space-between',
        }}
      >
        <SetterComponent
          {...setterProps}
          disabled={disabled}
          value={value}
          onChange={(v: unknown) => onChange({ [name]: v })}
          renderField={renderField}
        />
        <SetterSwitcher
          setterName={setterName}
          options={setterOptions}
          onChange={setActiveSetter}
        />
      </div>
    </Form.Item>
  )

  if (display === 'block') {
    return (
      <div className="mt-2 mb-2">
        <Typography.Title
          level={5}
          className="flex justify-between font-medium my-0 -mx-3 py-2 px-3 text-sm text-gray-700 bg-gray-100"
        >
          <div>{typeof title === 'string' ? title : title.label}</div>
          <SetterSwitcher
            setterName={setterName}
            options={setterOptions}
            onChange={setActiveSetter}
          />
        </Typography.Title>
        <div className="p-2">
          <SetterComponent
            {...setterProps}
            disabled={disabled}
            value={value}
            onChange={(v: unknown) => onChange({ [name]: v })}
            renderField={renderField}
          />
        </div>
      </div>
    )
  }

  return formItem
}

export function SettingPanel() {
  const { activeNode } = useActiveNode()
  const { schema, props, updateNodeProps } = useNodePropsById(
    activeNode?.id as string,
  )
  if (!schema || !props || !activeNode)
    return <div>请在画布中选择节点进行配置</div>

  return (
    <Tabs
      activeKey="props"
      centered
      className="flex-1 scale-100"
      items={[
        {
          key: 'props',
          label: '属性',
          children: (
            <Layout className="fixed inset-0 p-3 bg-transparent overflow-x-auto top-[50px] bottom-[12px]">
              <Form
                labelCol={{ span: 6 }}
                labelAlign="left"
                labelWrap
                colon={false}
                title="设置表单"
              >
                {schema.map((setterSchema) => (
                  <SetterField
                    key={`${activeNode?.id}-${setterSchema.name}`}
                    schema={setterSchema}
                    value={props[setterSchema.name]}
                    onChange={(...args) => activeNode.updateProps(...args)}
                  />
                ))}
              </Form>
            </Layout>
          ),
        },
      ]}
    />
  )
}

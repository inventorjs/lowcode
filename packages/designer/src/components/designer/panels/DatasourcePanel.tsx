import type { DataSourceSchema } from '@lowcode/types'
import { useEffect, useState } from 'react'
import {
  Button,
  List,
  Typography,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Popconfirm,
  message,
} from 'antd'

import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import { Panel } from './Panel'
import { useDataSources } from '@lowcode/engine'

const { Text } = Typography
const { useForm } = Form
const { TextArea, Search } = Input

function DataSourceEdit({
  data,
  open,
  onClose,
  onSubmit,
}: {
  data: DataSourceSchema | null
  open: boolean
  onClose: () => void
  onSubmit: (values: DataSourceSchema) => void
}) {
  const [form] = useForm()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
  }, [data, form])

  return (
    <Panel
      title={`${data ? '编辑' : '添加'}数据源`}
      open={open}
      onClose={onClose}
      style={{
        top: -1,
        left: '100%',
        width: 400,
        backgroundColor: 'rgb(250, 250, 250)',
      }}
    >
      <Form
        form={form}
        size="small"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onSubmit}
      >
        <Form.Item label="数据源ID" name="id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="请求类型"
          name="type"
          initialValue="fetch"
          rules={[{ required: true }]}
        >
          <Select options={[{ label: 'fetch', value: 'fetch' }]} />
        </Form.Item>
        <Form.Item
          label="请求方法"
          name={['options', 'method']}
          initialValue="GET"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="请求地址"
          name={['options', 'url']}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="请求参数">
          <Form.List name={['options', 'params']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Form.Item key={field.key} style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex' }}>
                      <Form.Item name={[field.name, 'key']} noStyle>
                        <Input style={{ width: 150 }} />
                      </Form.Item>
                      <span>{':'}</span>
                      <Form.Item name={[field.name, 'value']} noStyle>
                        <TextArea rows={1} size="small" />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(field.name)} />
                    </div>
                  </Form.Item>
                ))}
                <PlusCircleOutlined onClick={() => add()} />
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item label="请求头部">
          <Form.List name={['options', 'headers']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Form.Item key={field.key} style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex' }}>
                      <Form.Item name={[field.name, 'key']} noStyle>
                        <Input style={{ width: 150 }} />
                      </Form.Item>
                      <span>{':'}</span>
                      <Form.Item name={[field.name, 'value']} noStyle>
                        <Input />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(field.name)} />
                    </div>
                  </Form.Item>
                ))}
                <PlusCircleOutlined onClick={() => add()} />
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label="是否跨域"
          name={['options', 'isCors']}
          valuePropName="checked"
          initialValue={true}
          required={true}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="超时时间"
          name={['options', 'timeout']}
          initialValue={10}
          required={true}
        >
          <InputNumber />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form>
    </Panel>
  )
}

export function DatasourcePanel({
  open,
  pined,
  onClose,
  onPinToggle,
}: {
  open: boolean
  pined: boolean
  onClose: () => void
  onPinToggle: () => void
}) {
  const [filterText, setFilterText] = useState('')
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState<DataSourceSchema | null>(null)
  const { dataSources, addDataSource, updateDataSource, removeDataSource } =
    useDataSources()

  const handleAdd = () => {
    setOpenEdit(true)
    setEditData(null)
  }

  const handleSubmit = (values: DataSourceSchema) => {
    const existItem = dataSources.find((item) => item.id === values.id)
    const editItem = dataSources.find((item) => item.id === editData?.id)

    if (existItem && editItem !== existItem) {
      message.error('数据源ID重复')
      return
    }

    if (editItem) {
      updateDataSource(editItem.id, values)
      setEditData(values)
    } else {
      addDataSource(values as DataSourceSchema)
      setEditData(values)
    }
    message.success('数据源已更新')
  }
  const handleEdit = (id: string) => {
    const item = dataSources.find((item) => item.id === id)
    if (item) {
      setEditData(item)
      setOpenEdit(true)
    }
  }
  const handleRemove = (id: string) => {
    removeDataSource(id)
  }

  return (
    <Panel
      title="数据源"
      open={open}
      pined={pined}
      onClose={onClose}
      onPinToggle={onPinToggle}
    >
      <div className="flex justify-between gap-1">
        <Search
          size="small"
          enterButton
          allowClear
          placeholder="搜索数据源"
          onSearch={(v) => setFilterText(v)}
        />
        <Button size="small" onClick={handleAdd}>
          添加数据源
        </Button>
      </div>
      <div>
        <List
          dataSource={
            filterText
              ? dataSources.filter((item) => item.id.includes(filterText))
              : dataSources
          }
          itemLayout="horizontal"
          renderItem={(item) => (
            <List.Item
              actions={[
                <EditOutlined onClick={() => handleEdit(item.id)} />,
                <Popconfirm
                  title={
                    <>
                      确定删除<Text type="danger">{item.id}</Text>数据源?
                    </>
                  }
                  onConfirm={() => handleRemove(item.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <DeleteOutlined />,
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={item.id}
                description={
                  <>
                    <Text code>{item.options.method}</Text>
                    <Text code>{item.options.url}</Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>
      <DataSourceEdit
        open={openEdit}
        data={editData}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleSubmit}
      />
    </Panel>
  )
}

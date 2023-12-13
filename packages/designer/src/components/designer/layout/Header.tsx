import { Layout, Button, theme, message } from 'antd'
import { usePreviewSetting, useSave } from '@/hooks'

export function Header() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const { updatePreviewSetting } = usePreviewSetting()
  const { onSave } = useSave()

  const handleSave = () => {
    onSave()
    message.success('schema 保存成功')
  }

  return (
    <Layout.Header
      className="flex justify-between items-center h-12.5"
      style={{
        backgroundColor: colorBgContainer,
        border: '1px solid #f0f0f0',
      }}
    >
      <div>Logo</div>
      <div>
        <div className="flex gap-3">
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
          <Button
            onClick={() => {
              onSave()
              updatePreviewSetting({ open: true })
            }}
          >
            预览
          </Button>
          <Button>发布</Button>
        </div>
      </div>
    </Layout.Header>
  )
}

import { Drawer } from 'antd'
import { useIframeRenderer } from '@lowcode/engine'
import { usePreviewSetting } from '@/hooks'

function PreviewRender({ onLoad }: { onLoad: () => void }) {
  const { iframeRef } = useIframeRenderer()

  return (
    <iframe
      id="previewer"
      ref={iframeRef}
      style={{
        border: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
      }}
      onLoad={onLoad}
    />
  )
}

export function Previewer() {
  const { previewSetting, updatePreviewSetting, setIsLoading } =
    usePreviewSetting()

  return (
    <Drawer
      placement="bottom"
      title="页面预览"
      open={previewSetting.open}
      height="95%"
      onClose={() => updatePreviewSetting({ open: false })}
    >
      {previewSetting.open && (
        <PreviewRender onLoad={() => setIsLoading(false)} />
      )}
    </Drawer>
  )
}

import { Layout } from 'antd'
import { useIframeCanvas } from '@lowcode/engine'
import { CanvasTools } from './tools/CanvasTools'
import { useCanvasSetting } from '../../../hooks'

function Simulator() {
  const { iframeRef, onLoad } = useIframeCanvas()
  const { canvasSetting } = useCanvasSetting()
  const width = canvasSetting?.width

  return (
    <div
      className="absolute inset-0 m-auto flex justify-center items-center"
      style={{
        width,
        border: '1px solid #ccc',
      }}
    >
      <iframe
        id="simulator"
        className="absolute w-full h-full border-0 bg-white"
        ref={iframeRef}
        onLoad={onLoad}
      />
      <CanvasTools />
    </div>
  )
}

export function Canvas() {
  return (
    <Layout className="relative w-100 flex">
      <div className="absolute inset-4">
        <Simulator />
      </div>
    </Layout>
  )
}

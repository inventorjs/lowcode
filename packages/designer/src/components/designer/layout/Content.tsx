import { Layout } from 'antd'
import { Canvas } from '../canvas/Canvas'
import { Toolbar } from '../canvas/Toolbar'

export function Content() {
  return (
    <Layout.Content style={{ margin: 2 }}>
      <Layout style={{ height: '100%' }}>
        <Toolbar />
        <Canvas />
      </Layout>
    </Layout.Content>
  )
}

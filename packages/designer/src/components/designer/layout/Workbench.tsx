import { Layout } from 'antd'
import { useWorkbench } from '@lowcode/engine'
import { Header } from './Header'
import { Content } from './Content'
import { LeftSider } from './LeftSider'
import { RightSider } from './RightSider'

export function Workbench() {
  const { containerRef } = useWorkbench()

  return (
    <Layout ref={containerRef} className="h-screen">
      <Header />
      <Layout hasSider>
        <LeftSider />
        <Content />
        <RightSider />
      </Layout>
    </Layout>
  )
}

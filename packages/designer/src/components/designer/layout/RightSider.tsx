import { Layout, Breadcrumb, theme } from 'antd'
import { useActiveNode, useNodeAncestorById } from '@lowcode/engine'
import { SettingPanel } from '../panels/SettingPanel'

export function RightSider() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const { activeNode, setActiveNodeId } = useActiveNode()
  const { nodeAncestor } = useNodeAncestorById(activeNode?.id as string)

  return (
    <Layout.Sider theme="light" width={320}>
      <Layout
        style={{
          backgroundColor: colorBgContainer,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Layout.Header
          style={{
            backgroundColor: colorBgContainer,
            height: 42,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            paddingInline: 8,
          }}
        >
          {activeNode && (
            <Breadcrumb
              items={[
                ...[...nodeAncestor].reverse().map((node) => ({
                  title: node.title,
                  onClick: () => setActiveNodeId(node.id),
                  href: '#',
                })),
                {
                  title: activeNode.title,
                }
              ]}
              separator=">"
            />
          )}
        </Layout.Header>
        <SettingPanel />
      </Layout>
    </Layout.Sider>
  )
}

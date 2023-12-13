import { useState } from 'react'
import { Layout, Menu, theme } from 'antd'
import {
  AppstoreAddOutlined,
  ApartmentOutlined,
  EllipsisOutlined,
  ApiOutlined,
} from '@ant-design/icons'
import { ResourcePanel } from '../panels/ResourcePanel'
import { OutlinePanel } from '../panels/OutlinePanel'
import { SchemaPanel } from '../panels/SchemaPanel'
import { DatasourcePanel } from '../panels/DatasourcePanel'

export function LeftSider() {
  const [activePanel, setActivePanel] = useState<string>('resource')
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const [pinStatus, setPinStatus] = useState<Record<string, boolean>>({
    resource: true,
    outline: true,
    schema: false,
    datasource: false,
  })

  return (
    <Layout.Sider
      theme="light"
      collapsible
      trigger={null}
      width={pinStatus[activePanel] ? 313 : 50}
      collapsedWidth={pinStatus[activePanel] ? 313 : 50}
      collapsed={true}
    >
      <Layout className="flex flex-row h-full">
        <Layout
          className="flex flex-none w-12 flex-col justify-between"
          style={{
            backgroundColor: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activePanel]}
            multiple={true}
            onClick={({ key }) =>
              key === activePanel ? setActivePanel('') : setActivePanel(key)
            }
            items={[
              {
                key: 'resource',
                title: '物料面板',
                icon: <AppstoreAddOutlined />,
              },
              {
                key: 'outline',
                title: '大纲面板',
                icon: <ApartmentOutlined />,
              },
              {
                key: 'datasource',
                title: '数据源',
                icon: <ApiOutlined />,
              },
            ]}
          ></Menu>
          <Menu
            mode="inline"
            selectedKeys={[activePanel]}
            multiple={true}
            onClick={({ key }) =>
              key === activePanel ? setActivePanel('') : setActivePanel(key)
            }
            items={[
              {
                key: 'schema',
                title: '协议面板',
                icon: <EllipsisOutlined />,
              },
            ]}
          ></Menu>
        </Layout>
        <Layout className="realtive">
          <ResourcePanel
            open={activePanel === 'resource'}
            pined={pinStatus['resource']}
            onPinToggle={() =>
              setPinStatus({ ...pinStatus, resource: !pinStatus['resource'] })
            }
            onClose={() => setActivePanel('')}
          />
          <OutlinePanel
            open={activePanel === 'outline'}
            pined={pinStatus['outline']}
            onPinToggle={() =>
              setPinStatus({ ...pinStatus, outline: !pinStatus['outline'] })
            }
            onClose={() => setActivePanel('')}
          />
          <DatasourcePanel
            open={activePanel === 'datasource'}
            pined={pinStatus['datasource']}
            onPinToggle={() =>
              setPinStatus({
                ...pinStatus,
                datasource: !pinStatus['datasource'],
              })
            }
            onClose={() => setActivePanel('datasource')}
          />
          <SchemaPanel
            open={activePanel === 'schema'}
            pined={pinStatus['schema']}
            onPinToggle={() =>
              setPinStatus({ ...pinStatus, schema: !pinStatus['schema'] })
            }
            onClose={() => setActivePanel('resource')}
          />
        </Layout>
      </Layout>
    </Layout.Sider>
  )
}

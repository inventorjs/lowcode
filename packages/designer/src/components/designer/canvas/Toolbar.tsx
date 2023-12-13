import { useEffect, useState } from 'react'
import { Layout, Menu, theme } from 'antd'
import {
  PcIcon,
  PadIcon,
  MobileIcon,
  RedoIcon,
  UndoIcon,
  HistoryIcon,
} from '@/components/icons'
import { useCanvasSetting } from '@/hooks/useCanvasSetting'

type TermimalType = 'pc' | 'mobile' | 'pad'

const TERMINAL_MAP = {
  pc: 'auto',
  pad: 768,
  mobile: 375,
}

export function Toolbar() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const [activeKey, setActiveKey] = useState<TermimalType>('pc')
  const { updateCanvasSetting } = useCanvasSetting()

  useEffect(() => {
    updateCanvasSetting({ width: TERMINAL_MAP[activeKey] })
  }, [activeKey, updateCanvasSetting])

  return (
    <Layout.Header
      className="flex justify-end items-center h-10 px-4"
      style={{
        backgroundColor: colorBgContainer,
      }}
    >
      <Menu
        mode="inline"
        className="flex justify-around items-center border-x-0 w-25"
        style={{
          borderInline: 0,
        }}
        multiple={true}
        inlineIndent={3}
        selectedKeys={[activeKey]}
        items={[
          {
            key: 'pc',
            title: 'PC端',
            label: <PcIcon />,
          },
          {
            key: 'pad',
            title: 'Pad端',
            label: <PadIcon />,
          },
          {
            key: 'mobile',
            title: '移动端',
            label: <MobileIcon />,
          },
        ].map((item) => ({
          ...item,
          className: '!rounded text-center !h-7.5 !ps-0 !pe-0',
        }))}
        onClick={({ key }) => setActiveKey(key as TermimalType)}
      ></Menu>
      <div className="w-0.5 h-3/5 mx-2 bg-gray-200" />
      <Menu
        mode="inline"
        className="flex justify-arround items-center border-0 w-25"
        style={{
          borderInline: 0,
        }}
        multiple={true}
        inlineIndent={3}
        selectedKeys={[]}
        items={[
          {
            key: 'undo',
            title: '撤销',
            label: <UndoIcon />,
          },
          {
            key: 'redo',
            title: '重做',
            label: <RedoIcon />,
          },
          {
            key: 'history',
            title: '历史记录',
            label: <HistoryIcon />,
          },
        ].map((item) => ({
          ...item,
          className: '!rounded text-center !h-7.5 !ps-0 !pe-0',
        }))}
      />
    </Layout.Header>
  )
}

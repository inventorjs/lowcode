import { Card } from 'antd'
import { CloseSquareOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'
import { PinIcon, UnPinIcon } from '@/components/icons'

export function Panel({
  title,
  open,
  style = {},
  bodyStyle = {},
  pined,
  children,
  onClose,
  onPinToggle,
}: {
  title: string
  open: boolean
  style?: CSSProperties
  bodyStyle?: CSSProperties
  width?: number
  pined: boolean
  children: React.ReactNode
  onClose: () => void
  onPinToggle: () => void
}) {
  if (!open) return null

  return (
    <Card
      title={title}
      className="rounded-none h-full"
      style={{
        width: 266,
        position: 'absolute',
        zIndex: 1,
        transform: 'scale(1)',
        ...style,
      }}
      bodyStyle={{ padding: '10px 4px', ...bodyStyle }}
      extra={
        <div className="flex gap-2 cursor-pointer">
          { pined && <PinIcon onClick={() => onPinToggle()}/> }
          { !pined && <UnPinIcon onClick={() => onPinToggle()}/> }
          <CloseSquareOutlined onClick={onClose} />
        </div>
      }
    >
      {children}
    </Card>
  )
}

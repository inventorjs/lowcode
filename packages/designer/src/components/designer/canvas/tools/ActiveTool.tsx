import {
  useActiveNode,
  useActiveNodeDomRect,
  useCanvasState,
  useMaterialBehaviorByName,
  useNodeAncestorById,
} from '@lowcode/engine'
import { useEffect, useRef, useState } from 'react'
import { Button, Dropdown, type ButtonProps } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

export interface ActionItemProps {
  title?: string
  type?: ButtonProps['type']
  icon?: React.ReactNode
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onFocus?: () => void
}

function ActionItem({
  title = '',
  type = 'primary',
  icon,
  onClick,
}: ActionItemProps) {
  return (
    <Button
      type={type}
      title={title}
      className="flex justify-center items-center w-5 h-5 rounded"
      icon={icon}
      onClick={onClick}
    />
  )
}

function DropdownItem({
  title = '',
  type = 'primary',
  icon,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
}: ActionItemProps) {
  return (
    <Button
      type={type}
      icon={icon}
      className="flex justify-center items-center h-5 px-2 py-1 mr-0.5 rounded"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
    >
      {title}
    </Button>
  )
}

export function ActiveTool() {
  const { activeNode, setActiveNodeId, removeActiveNode } = useActiveNode()
  const { activeNodeDomRect } = useActiveNodeDomRect()
  const { behavior } = useMaterialBehaviorByName(
    activeNode?.componentName as string,
  )
  const { nodeAncestor } = useNodeAncestorById(activeNode?.id as string)
  const { canvasState } = useCanvasState()
  const [right, setRight] = useState(0)
  const toolRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeNodeDomRect && toolRef.current) {
      const { left } = toolRef.current.getBoundingClientRect()
      const right = -Math.max((canvasState?.domRect.left ?? 0) - left, 0)
      setRight(right)
    }
  }, [activeNodeDomRect, canvasState])

  if (!activeNodeDomRect || !activeNode) return null

  const { top, left, width, height } = activeNodeDomRect

  if (!width || !height) return null

  return (
    <div
      className="absolute pointer-events-none border-1 border-solid border-2 border-blue-500"
      style={{
        top,
        left,
        width,
        height,
      }}
    >
      <div
        ref={toolRef}
        className="absolute flex justify-end"
        style={{
          top: top - 23 > 0 ? -23 : 0,
          right,
        }}
      >
        <div className="flex pointer-events-auto">
          {nodeAncestor.length > 0 && (
            <Dropdown
              dropdownRender={() => (
                <>
                  {nodeAncestor?.map((node, index) => (
                    <DropdownItem
                      key={index}
                      title={node?.title}
                      onClick={() => setActiveNodeId(node?.id as string)}
                    />
                  ))}
                </>
              )}
              placement="bottom"
              destroyPopupOnHide={true}
            >
              <div>
                <DropdownItem title={activeNode.title} />
              </div>
            </Dropdown>
          )}
          {behavior?.canRemove() && (
            <ActionItem
              title="删除"
              icon={<DeleteOutlined />}
              onClick={() => removeActiveNode()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

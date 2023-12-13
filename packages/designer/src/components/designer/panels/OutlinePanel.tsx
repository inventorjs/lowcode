import { useState, useRef, useEffect } from 'react'
import { Card, Input, Tag, Tree, type InputRef } from 'antd'
import {
  isJSSlot,
  useActiveNode,
  useRootNode,
  useActiveDocument,
  useHoverNode,
  useMaterialBehaviorByName,
  useModalNodes,
  useEngine,
} from '@lowcode/engine'
import type { JSSlot, INode, Props } from '@lowcode/types'
import {
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Panel } from './Panel'
import { useOutlineExpandedKeys } from '@/hooks'

function TreeNodeTitle({ node: nodeOrSlot }: { node: INode | JSSlot }) {
  const node = nodeOrSlot as INode
  const { activeNode, setActiveNodeId } = useActiveNode()
  const { hoverNode, setHoverNodeId } = useHoverNode()
  const { behavior } = useMaterialBehaviorByName((node as INode).componentName)
  const [editData, setEditData] = useState<null | {
    title: string
    id: string
  }>(null)
  const editInputRef = useRef<InputRef>(null)

  const hidden = !!node?.hidden
  const locked = !!node?.locked
  const isHover = node.id && hoverNode?.id === node.id
  const isActive = activeNode?.id && activeNode?.id === node.id
  const isShowDelete = (isHover || isActive) && !!behavior?.canRemove()
  const isShowHidden = isHover || isActive || hidden
  const isShowLocked = isHover || isActive || locked
  const isShowEdit = isHover || isActive
  const isSlot = isJSSlot(nodeOrSlot as JSSlot)
  const isActiveNode = activeNode?.id && activeNode.id === node.id

  useEffect(() => {
    if (editData) {
      editInputRef.current?.focus()
    }
  }, [editData])

  if (!node) return null

  if (editData) {
    return (
      <Input
        value={editData.title}
        size="small"
        ref={editInputRef}
        onChange={(e) =>
          setEditData({ ...editData, title: e.target.value })
        }
        onBlur={() => {
          setEditData(null)
          node.setTitle(editData.title)
        }}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.code === 'Enter') {
            setEditData(null)
            node.setTitle(editData.title)
          }
        }}
      />
    )
  }

  return (
    <div
      className="flex justify-between"
      onMouseOver={() => {
        !!behavior?.canHover() &&
          !isActiveNode &&
          setHoverNodeId(node.id as string)
      }}
      onMouseLeave={() => !!behavior?.canHover() && setHoverNodeId(null)}
      onClick={() => {
        if (behavior?.canSelect()) {
          setActiveNodeId(node.id as string)
        }
      }}
    >
      <div
        className="flex items-center"
        onMouseOver={(evt) => evt.stopPropagation()}
      >
        {node.title}
        {isSlot && <Tag color="purple">插槽</Tag>}
      </div>
      <div className="flex gap-1" onClick={(evt) => evt.stopPropagation()}>
        {isShowEdit && (
          <EditOutlined
            onClick={() =>
              setEditData({
                title: node.title as string,
                id: node.id as string,
              })
            }
          />
        )}
        {isShowDelete && <DeleteOutlined onClick={() => node.remove()} />}
        {isShowHidden &&
          (hidden ? (
            <EyeOutlined onClick={() => node.setHidden(false)} />
          ) : (
            <EyeInvisibleOutlined onClick={() => node.setHidden(true)} />
          ))}
        {isShowLocked &&
          (locked ? (
            <LockOutlined onClick={() => node.setLocked(false)} />
          ) : (
            <UnlockOutlined onClick={() => node.setLocked(true)} />
          ))}
      </div>
    </div>
  )
}

function TreeComponent({
  rootNode,
  isModalTree,
}: {
  rootNode?: INode
  isModalTree: boolean
}) {
  const { engine } = useEngine()
  const { activeDocument } = useActiveDocument()
  const { activeNode } = useActiveNode()
  const { expandedKeys, setExpandedKeys } = useOutlineExpandedKeys()

  if (!activeDocument || !rootNode) return null

  function getPropsTreeData(props: Props): any {
    return Object.values(props)
      .map((val) => {
        const slotVal = val as JSSlot
        if (isJSSlot(slotVal) && slotVal.id) {
          return {
            key: slotVal.id,
            selectable: false,
            title: <TreeNodeTitle node={slotVal} />,
            children: getTreeData(slotVal.id)?.children ?? [],
          }
        } else if (slotVal && typeof slotVal === 'object') {
          return getPropsTreeData(slotVal)
        }
      })
      .filter(Boolean)
  }

  function getTreeData(nodeId: string): any {
    const node = activeDocument!.getNodeById(nodeId)
    const meta = engine.materials.getMetaByName(node?.componentName as string)
    if (!node || !meta || (!isModalTree && meta.isModal)) return
    const propsTreeData = getPropsTreeData(node.props).flat(Infinity)
    return {
      title: <TreeNodeTitle node={node} />,
      key: nodeId,
      children: [
        ...propsTreeData,
        ...(node.childIds
          ?.map((childId) => getTreeData(childId))
          .filter(Boolean) ?? []),
      ],
    }
  }

  const treeData = [getTreeData(rootNode.id)].filter(Boolean)

  return (
    <Tree
      className="mt-4"
      treeData={treeData}
      expandedKeys={expandedKeys ?? []}
      blockNode={true}
      showLine={true}
      showIcon={true}
      selectedKeys={[activeNode?.id ?? '']}
      onExpand={(expandedKeys: string[]) =>
        setExpandedKeys(expandedKeys as string[])
      }
    />
  )
}

export function ModalCard() {
  const { modalNodes } = useModalNodes()
  if (!modalNodes?.length) return null

  return (
    <Card
      title="模态视图层"
      headStyle={{
        height: 32,
        minHeight: 32,
        fontWeight: 400,
        fontSize: 12,
        borderRadius: 0,
        backgroundColor: 'rgba(31,56,88,.04)',
      }}
      bodyStyle={{ padding: 0 }}
      style={{ borderRadius: 3 }}
    >
      {modalNodes.map((node, index) => (
        <TreeComponent rootNode={node} isModalTree={true} key={index} />
      ))}
    </Card>
  )
}

export function TreeCard() {
  const { rootNode } = useRootNode()
  if (!rootNode) return null

  return (
    <Card
      title="组件树"
      className="mt-3"
      headStyle={{
        height: 32,
        minHeight: 32,
        fontWeight: 400,
        fontSize: 12,
        borderRadius: 0,
        backgroundColor: 'rgba(31,56,88,.04)',
      }}
      bodyStyle={{ padding: 0 }}
      style={{ borderRadius: 3 }}
    >
      <TreeComponent rootNode={rootNode} isModalTree={false} />
    </Card>
  )
}

export function OutlinePanel({
  open,
  pined,
  onClose,
  onPinToggle,
}: {
  open: boolean
  pined: boolean
  onClose: () => void
  onPinToggle: () => void
}) {
  return (
    <Panel
      title="大纲树"
      open={open}
      pined={pined}
      onClose={onClose}
      onPinToggle={onPinToggle}
      style={{ transform: 'scale(1)' }}
      bodyStyle={{
        position: 'fixed',
        inset: 0,
        top: 54,
        padding: 12,
        paddingBottom: 0,
        bottom: 12,
        overflow: 'auto',
      }}
    >
      <ModalCard />
      <TreeCard />
    </Panel>
  )
}

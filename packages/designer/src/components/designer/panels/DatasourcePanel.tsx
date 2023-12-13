import { Panel } from './Panel'

export function DatasourcePanel({
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
      title="数据源"
      open={open}
      pined={pined}
      onClose={onClose}
      onPinToggle={onPinToggle}
    >
      数据源面板
    </Panel>
  )
}

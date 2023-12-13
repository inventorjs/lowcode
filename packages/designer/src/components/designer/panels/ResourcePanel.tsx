import { useMaterialResources } from '@lowcode/engine'
import { Panel } from './Panel'
import { LCResource } from '../components/LCResource'

export function ResourcePanel({
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
  const { categoryResources } = useMaterialResources()

  return (
    <Panel
      title="组件"
      open={open}
      pined={pined}
      onClose={onClose}
      onPinToggle={onPinToggle}
    >
      {categoryResources?.map((category, index) => (
        <div key={index} className="pb-5">
          <div style={{ fontSize: 13, color: '#666' }}>{category.name}</div>
          <div className="flex flex-wrap">
            {category.resources.map((resource) => (
              <LCResource key={resource.id} resourceId={resource.id} />
            ))}
          </div>
        </div>
      ))}
    </Panel>
  )
}

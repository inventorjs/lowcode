import { useEngine } from '@lowcode/engine'
import { Panel } from './Panel'
import { CodeEditor } from '../components/CodeEditor'

export function SchemaPanel({
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
  const { engine } = useEngine()

  return (
    <Panel
      title="页面协议"
      open={open}
      pined={pined}
      onClose={onClose}
      onPinToggle={onPinToggle}
      style={{
        width: 800,
        position: 'absolute',
        zIndex: 1,
        transform: 'scale(1)',
      }}
    >
      <div className="fixed inset-0 top-[50px] p-[20px]">
        <CodeEditor
          language="json"
          options={{ readOnly: true }}
          value={JSON.stringify(engine.document?.schema, null, 2)}
        />
      </div>
    </Panel>
  )
}

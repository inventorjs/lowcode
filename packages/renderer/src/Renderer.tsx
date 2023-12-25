import type { NodeSchema, Props, JSSlot } from '@lowcode/types'
import React from 'react'

const JSSLOT_TYPE = 'JSSlot'
const ROOT_COMPONENT = 'Root'

export interface RendererProps {
  components: Record<string, React.FC<any>>
  schema: NodeSchema
}

function parseProps(props: Props, components: RendererProps['components']) {
  const realProps: Props = {}
  Object.entries(props).forEach(([key, val]) => {
    const slotVal = val as JSSlot
    if (slotVal.type === JSSLOT_TYPE) {
      realProps[key] = (
        <>
          {slotVal?.value?.map((schema, index) => (
            <ComponentRenderer
              key={index}
              schema={schema}
              components={components}
            />
          ))}
        </>
      )
    } else if (val && typeof val === 'object') {
      realProps[key] = parseProps(val as Props, components)
    } else {
      realProps[key] = val
    }
  })
  return realProps
}

function ComponentRenderer({ components, schema }: RendererProps) {
  let Component = components[schema.componentName]
  if (!Component) {
    if (ROOT_COMPONENT !== schema.componentName) {
      return null
    }
    Component = ({ children }) => children
  }

  const props = parseProps(schema.props, components)

  return (
    <Component {...props}>
      {schema.children?.map((schema) => (
        <ComponentRenderer
          key={schema.id}
          schema={schema}
          components={components}
        />
      ))}
    </Component>
  )
}

export function Renderer({ components, schema }: RendererProps) {
  return <ComponentRenderer components={components} schema={schema} />
}

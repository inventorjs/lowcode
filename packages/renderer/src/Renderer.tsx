import type { NodeSchema, Props, JSSlot } from '@lowcode/types'
import React from 'react'

export interface RendererProps {
  components: Record<string, React.FC<any>>
  schema: NodeSchema
}

function parseProps(
  props: Props,
  components: RendererProps['components'],
) {
  const realProps: Props = {}
  Object.entries(props).forEach(([key, val]) => {
    const slotVal = val as JSSlot
    if (slotVal.type === 'JSSlot') {
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
  const Component = components[schema.componentName]
  if (!Component) return null

  const props = parseProps(schema.props, components)

  return (
    <Component {...props}>
      {schema.children?.map((schema) => (
        <ComponentRenderer schema={schema} components={components} />
      ))}
    </Component>
  )
}

export function Renderer({ components, schema }: RendererProps) {
  return <ComponentRenderer components={components} schema={schema} />
}

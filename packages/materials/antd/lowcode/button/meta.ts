import type { ComponentMetaSchema } from '@inventorjs/lc-types'

const componentName = 'Button'
export const Button: ComponentMetaSchema = {
  componentName,
  title: '按钮组件',
  props: [
    {
      name: 'children',
      title: '按钮',
      setter: 'StringSetter'
    },
    {
      name: 'onClick',
      title: 'onClick',
      setter: 'FunctionSetter',
    },
  ],
  snippets: [
    {
      title: '按钮组件',
      schema: {
        componentName,
        children: [],
        props: {
          children: '内容',
        },
      },
    },
  ],
}

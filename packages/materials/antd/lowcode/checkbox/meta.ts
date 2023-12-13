import { type ComponentMetaSchema } from '@inventorjs/lc-types'

const componentName = 'Checkbox'
export const Checkbox: ComponentMetaSchema = {
  componentName,
  title: '复选组件',
  props: [
    {
      name: 'children',
      title: '复选内容',
      setter: 'StringSetter',
    },
  ],
  snippets: [
    {
      title: '复选组件',
      schema: {
        componentName,
        children: [],
        props: {
          children: '复选内容',
        },
      },
    },
  ],
}

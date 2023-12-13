import { type ComponentMetaSchema } from '@inventorjs/lc-types'

const componentName = 'Input'
export const Input: ComponentMetaSchema = {
  componentName,
  title: '输入框',
  props: [],
  snippets: [
    {
      title: '输入框',
      schema: {
        componentName,
        children: [],
        props: {},
      },
    },
  ],
}

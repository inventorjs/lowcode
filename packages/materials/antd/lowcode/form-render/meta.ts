import { type ComponentMetaSchema } from '@inventorjs/lc-types'

const componentName = 'FormRender'
export const FormRender: ComponentMetaSchema = {
  componentName,
  title: '表单渲染',
  props: [],
  snippets: [
    {
      title: '表单渲染',
      schema: {
        componentName,
        selfRender: true,
        children: [],
        props: {},
      },
    },
  ],
  configure: {
    component: {
      isContainer: true,
    },
  },
}

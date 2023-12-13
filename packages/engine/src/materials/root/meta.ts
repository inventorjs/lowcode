import type { ComponentMetaSchema } from '@lowcode/types'

const componentName = 'Root'
export const Root: ComponentMetaSchema = {
  componentName,
  title: 'Root',
  props: [],
  configure: {
    component: {
      isContainer: true,
      disableBehaviors: ['move', 'remove', 'copy'],
    },
  },
  snippets: [
    {
      title: 'Root',
      schema: {
        componentName,
        props: {},
        children: [],
      },
    },
  ],
}

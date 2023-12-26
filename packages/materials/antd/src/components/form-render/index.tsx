import { forwardRef } from 'react'
import AntdFormRender, { useForm } from 'form-render'

const Editor = forwardRef<HTMLDivElement, Record<string, any>>(function Editor(
  { children }: Record<string, any>,
  ref,
) {
  return (
    <div ref={ref} style={{ width: 100, height: 100 }}>
      {children}
    </div>
  )
})

function Render(props: Record<string, any>) {
  console.log(props, '---')
  const form = useForm()
  const schema = {
    type: 'object',
    properties: {
      input: {
        title: '输入框',
        type: 'string',
        widget: 'input',
      },
      select: {
        title: '下拉框',
        type: 'string',
        widget: 'select',
        props: {
          options: [
            { label: '早', value: 'a' },
            { label: '中', value: 'b' },
            { label: '晚', value: 'c' },
          ],
        },
      },
    },
  }

  return <AntdFormRender form={form} schema={schema} />
}

export const FormRender = forwardRef<HTMLElement, Record<string, any>>(
  function FormRender(props, ref) {
    const { __lc_engine } = props
    if (__lc_engine) {
      return <Editor {...props} ref={ref} />
    }

    return <Render {...props} />
  },
)

import type { Props } from '@lowcode/types'
import { forwardRef, Children } from 'react'

export const Slot = forwardRef<HTMLDivElement>(
  ({ children, __lcmode }: Props, ref) => {
    if (Children.toArray(children)?.length > 0) return children
    if (__lcmode !== 'design') {
      return null
    }

    return (
      <div
        ref={ref}
        style={{
          minWidth: 30,
          minHeight: 30,
          color: 'grey',
          backgroundColor: 'lightgrey',
          border: '1px dashed grey',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 16,
        }}
      >
        请拖入组件
      </div>
    )
  },
)

import type { Props } from '@lowcode/types'
import { forwardRef } from 'react'

export const Root = forwardRef<HTMLDivElement>(
  ({ children }: Props, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    )
  },
)

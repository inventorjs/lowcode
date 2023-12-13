import { type FC, type Ref, forwardRef } from 'react'

export function withWrap(Comp: FC<any>) {
  return forwardRef((props: any, ref: Ref<any>) => (
    <Comp {...props} ref={ref} />
  ))
}

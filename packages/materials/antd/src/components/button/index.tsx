import { forwardRef } from 'react'
import { Button as AntdButton } from 'antd'

export const Button = forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode }
>(function Button({ children }, ref) {
  return <AntdButton ref={ref}>{children}</AntdButton>
})

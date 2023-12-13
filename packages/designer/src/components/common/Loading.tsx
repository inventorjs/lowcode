import { Spin } from 'antd'

export function Loading({ loading = true }: { loading?: boolean } = {}) {
  return (
    <Spin
      className="w-screen h-screen flex justify-center items-center"
      size="large"
      spinning={loading}
    />
  )
}

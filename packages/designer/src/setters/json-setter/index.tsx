import { useEffect, useState, useMemo } from 'react'
import type { SetterProps } from '@lowcode/types'
import { Input } from 'antd'

export function JsonSetter({
  value,
  disabled,
  onChange,
}: SetterProps<Record<string, unknown> | null>) {
  const [editJson, setEditJson] = useState<string>()

  useEffect(() => {
    setEditJson(JSON.stringify(value, null, 2))
  }, [value])

  const jsonObj = useMemo(() => {
    let jsonObj: Record<string, unknown> | null = null
    try {
      jsonObj = JSON.parse(editJson as string) as Record<string, unknown>
    } catch (err) {
      //
    }
    return jsonObj
  }, [editJson])

  return (
    <Input.TextArea
      value={editJson}
      disabled={disabled}
      size="small"
      onChange={(e) => setEditJson(e.target.value)}
      onBlur={() => onChange(jsonObj)}
    />
  )
}

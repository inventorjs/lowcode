import type { JSSlot, ComponentPropSchema, SetterType } from '@lowcode/types'
import { useState, useEffect, useRef } from 'react'
import { useEngine } from './useEngine'
import { useActiveNode } from './useActiveNode'
import { JS_SLOT } from '../common/constants'
import { isSlotSetter } from '../common/util'

function getSetterInfo(setter: SetterType, schema: ComponentPropSchema) {
  let setterName = ''
  let setterProps: Record<string, unknown> = {}
  let defaultValue = schema.defaultValue
  if (typeof setter === 'string') {
    setterName = setter
    setterProps = {}
  } else {
    setterName = setter.componentName
    setterProps = setter.props
    defaultValue = setter.defaultValue ?? schema.defaultValue
  }
  return { setterName, setterProps, defaultValue }
}

function getActiveSetter(setter: SetterType | SetterType[], value: unknown) {
  if (!Array.isArray(setter)) {
    return setter
  }
  const activeSetter = setter.find(
    (setterItem) =>
      typeof setterItem !== 'string' &&
      typeof setterItem.defaultValue === typeof value,
  )
  if (typeof value === 'undefined' || !activeSetter) {
    return setter[0]
  }
  return activeSetter
}

export function useSetterField({
  schema,
  value,
  onChange,
}: {
  schema: ComponentPropSchema
  value: unknown
  onChange: (v: Record<string, unknown>) => void
}) {
  const { name, title, setter, display, disabled, condition } = schema
  const [activeSetter, setActiveSetter] = useState<SetterType>(
    getActiveSetter(setter, value),
  )
  const { setterName, setterProps, defaultValue } = getSetterInfo(
    activeSetter,
    schema,
  )
  const setterNameRef = useRef<string>(setterName)
  const initIdRef = useRef<string>('')
  const { engine } = useEngine()
  const { activeNode } = useActiveNode()
  let visible = true

  useEffect(() => {
    if (
      !!activeNode &&
      ((typeof value === 'undefined' &&
        typeof defaultValue !== 'undefined' &&
        initIdRef.current !== activeNode.id) ||
        setterNameRef.current !== setterName)
    ) {
      if (
        initIdRef.current === activeNode.id &&
        setterNameRef.current !== setterName &&
        isSlotSetter(setterNameRef.current)
      ) {
        const slotNode = engine.document?.getNodeById((value as JSSlot).id as string)
        slotNode?.remove()
      }

      const activeNodeId = activeNode.id
      initIdRef.current = activeNodeId

      if (isSlotSetter(setterName)) {
        const slotDefaultValue = defaultValue as JSSlot
        const slotNode = engine?.document?.createSlotNode(
          activeNodeId,
          slotDefaultValue,
        )
        if (slotNode) {
          onChange({
            [name]: {
              id: slotNode.id,
              title,
              type: JS_SLOT,
              enabled:
                !!slotDefaultValue.value?.length || slotDefaultValue.enabled,
              value: [],
            },
          })
        }
      } else {
        onChange({ [name]: defaultValue })
      }
    }
  }, [
    value,
    defaultValue,
    onChange,
    name,
    activeNode,
    engine?.document,
    setterName,
    title,
  ])

  useEffect(() => {
    setterNameRef.current = setterName
  }, [setterName])

  if (activeNode && typeof condition === 'function' && !condition(activeNode)) {
    visible = false
    if (typeof value !== 'undefined') {
      setTimeout(() => onChange({ [name]: undefined }))
    }
  }

  const setterOptions = Array.isArray(setter)
    ? setter.map((setterItem) => {
        const { setterName } = getSetterInfo(setterItem, schema)
        return {
          setter: setterItem,
          value: setterName,
          label: setterName,
        }
      })
    : null

  return {
    name,
    title,
    display,
    disabled,
    visible,
    setterName,
    setterProps,
    activeSetter,
    setActiveSetter,
    setterOptions,
  }
}

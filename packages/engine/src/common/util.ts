/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { JSExpression, JSFunction, JSSlot } from '@lowcode/types'
import {
  LC_ENGINE,
  JS_SLOT,
  SLOT_SETTER,
  JS_FUNCTION,
  JS_EXPRESSION,
} from './constants'

export function uniqId(prefix = '') {
  const realPrefix = prefix && prefix + '-'
  return realPrefix + Math.random().toString(32).substring(2)
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()
}

export function getEngine() {
  return window[LC_ENGINE]
}

export function isJSSlot(val: JSSlot) {
  return val?.type === JS_SLOT
}

export function isJSFunction(val: JSFunction) {
  return val?.type === JS_FUNCTION
}

export function isJSExpression(val: JSExpression) {
  return val?.type === JS_EXPRESSION
}

export function isSlotSetter(setterName: string) {
  return setterName === SLOT_SETTER
}

import { Slots } from "vue"
import { isFunction } from "./is"

export const getSlot = (slots: Slots, slot = "default", data?: Recordable) => {
  // Reflect.has 判断一个对象是否存在某个属性
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn || !isFunction(slotFn)) return null
  return slotFn(data)
}

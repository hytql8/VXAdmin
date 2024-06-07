import { omitSetting } from "@/constants"
import type { TableColumnParameterTypes } from "@/components/Table/src/types"

// 筛选TableSetting 需要排除的表单项配置

const filterBySetting = (data: TableColumnParameterTypes[]) => {
  console.log()
  const settingSet = new Set(omitSetting)
  const result = [] as TableColumnParameterTypes[]
  for (let v of data) {
    if (v.filed) {
      console.log(v)
    }
  }
  return data
}

export { filterBySetting }

<script lang="tsx">
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElPopover, ElCheckbox, ElTree, ElScrollbar, ElTooltip } from "element-plus"
import type { ComponentSize } from "element-plus"
import { computed, defineComponent, unref, ref, nextTick, type VNode } from "vue"
import type { PropType } from "vue"
import { VxIcon } from "@/components/VxIcon"
import { useAppStore } from "@/store/modules/app"
import { useI18n } from "vue-i18n"
import type { TableColumnParameterTypes } from "@/components/Table/src/types"
import { filterBySetting } from "../helper"

export default defineComponent({
  name: "TableSetting",
  props: {
    slot: {
      type: Object as PropType<VNode>
    },
    data: {
      type: Array as PropType<TableColumnParameterTypes[]>,
      default: () => []
    }
  },
  emits: ["changeSize", "refresh", "changeFullScreen"],

  setup(props, { emit }) {
    const appStore = useAppStore()
    const columnSize = computed(() => appStore.getColumnSize)
    const { t } = useI18n()
    const changeSize = (size: ComponentSize) => {
      emit("changeSize", size)
    }

    const refresh = () => {
      emit("refresh")
    }

    const isFullSrceen = ref(false)

    const changeFullScreen = () => {
      isFullSrceen.value = !unref(isFullSrceen)
      emit("changeFullScreen", unref(isFullSrceen))
    }

    console.log(props.data)
    // 构造table的表头结构树
    const data = computed(() => filterBySetting(props.data))

    const prevClick = (node: TableColumnParameterTypes) => (e: Event) => {
      e.preventDefault()
      console.log(node, e)
    }

    const nextClick = (e: Event) => {
      e.preventDefault()
      console.log(1)
    }

    return () => (
      <div class="vx-table-setting-style">
        <div class="setting-slot">{props.slot}</div>
        <div class="setting-option">
          <VxIcon onClick={refresh} class="vx-icon" color="var(--el-text-color-regular)" size={22} icon="mdi:refresh" />
          <ElDropdown trigger="click" onCommand={changeSize}>
            {{
              default: () => (
                <VxIcon class="vx-icon" color="var(--el-text-color-regular)" size={18} icon="mdi:arrow-expand-vertical" />
              ),
              dropdown: () => {
                return (
                  <ElDropdownMenu>
                    {{
                      default: () => {
                        return unref(columnSize).map((v: string) => (
                          <ElDropdownItem key={v} command={v}>
                            {t(`size.${v}`)}
                          </ElDropdownItem>
                        ))
                      }
                    }}
                  </ElDropdownMenu>
                )
              }
            }}
          </ElDropdown>
          <ElPopover placement="bottom" width={400} trigger="click">
            {{
              default: () => {
                return (
                  <>
                    <div class="column-selection">
                      <div class="column-selection__header">
                        <div class="header-total">
                          <ElCheckbox></ElCheckbox> <span class="header-total-sum">列展示</span>
                        </div>
                        <div>还原</div>
                      </div>
                      <ElScrollbar style="max-height: 300px;padding: 0 10px 0 0">
                        <ElTree
                          check-strictly
                          expand-on-click-node={false}
                          default-expand-all
                          draggable
                          show-checkbox
                          data={unref(data)}
                          props={{
                            label: "label",
                            children: "children"
                          }}
                        >
                          {{
                            default: ({ node }) => {
                              return (
                                <div class="treenode-group">
                                  <span>{node.label}</span>
                                  <div class="icon-group">
                                    <ElTooltip effect="dark" content="固定在左侧" placement="top-start">
                                      {{
                                        default: () => (
                                          <VxIcon
                                            onClick={prevClick(node)}
                                            class="icon-left"
                                            icon="line-md:arrow-close-left"
                                            color="#8D9095"
                                            size={16}
                                          />
                                        )
                                      }}
                                    </ElTooltip>
                                    <ElTooltip effect="dark" content="固定在右侧" placement="top-start">
                                      {{
                                        default: () => (
                                          <VxIcon
                                            onClick={nextClick}
                                            icon="line-md:arrow-close-right"
                                            color="#8D9095"
                                            size={16}
                                          />
                                        )
                                      }}
                                    </ElTooltip>
                                  </div>
                                </div>
                              )
                            }
                          }}
                        </ElTree>
                      </ElScrollbar>
                    </div>
                  </>
                )
              },
              reference: () => {
                return (
                  <>
                    <VxIcon
                      class="vx-icon"
                      color="var(--el-text-color-regular)"
                      size={18}
                      icon="material-symbols:settings-outline"
                    />
                  </>
                )
              }
            }}
          </ElPopover>

          <VxIcon
            class="vx-icon"
            onClick={changeFullScreen}
            color="var(--el-text-color-regular)"
            size={18}
            icon="material-symbols:fullscreen"
          />
        </div>
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
@use "./TableSetting.scss";
</style>

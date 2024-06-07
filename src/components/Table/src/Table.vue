<script lang="tsx">
import { ref, unref, toRefs, onMounted, reactive, computed, defineComponent, nextTick, PropType, CSSProperties } from "vue"
import { ElTable, ElTableColumn, ElPagination } from "element-plus"
import type { ElTooltipProps } from "element-plus"
import type { TableParameterTypes, TableColumnParameterTypes, Pagination, TableSetProps } from "./types"
import { getSlot } from "@/utils/tsxUtils"
import { get, set } from "lodash-es"
import TableSetting from "./components/TableSettings.vue"
import { useFullscreen } from "@vueuse/core"

/**  接受参数详情请见 @type TableParameterTypes */
export default defineComponent({
  name: "VxTable",
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    showOverflowTooltip: {
      type: Boolean,
      default: false
    },
    // 是否展示分页
    pagination: {
      type: Object as PropType<Pagination>,
      default: (): Pagination | undefined => undefined
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 是否叠加索引
    reserveIndex: {
      type: Boolean,
      default: false
    },
    // 对齐方式
    align: {
      type: String as PropType<string & ("left" | "center" | "right")>,
      default: "left"
    },
    // 表头对齐方式
    headerAlign: {
      type: String as PropType<string & ("left" | "center" | "right")>,
      default: "left"
    },
    // 图片自动预览字段数组
    imagePreview: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    // 视频自动预览字段数组
    videoPreview: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    columns: {
      type: Array as PropType<TableColumnParameterTypes[]>,
      default: () => []
    },
    height: {
      type: [String, Number] as PropType<string | number>
    },
    maxHeight: {
      type: [String, Number] as PropType<string | number>
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as PropType<string & ("large" | "default" | "small")>,
      default: "default"
    },
    fit: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    showHeader: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    currentRowKey: {
      type: [String, Number] as PropType<string | number>
    },
    rowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: ""
    },
    rowStyle: {
      type: [Function, Object] as PropType<(row: Recordable, rowIndex: number) => Recordable | CSSProperties>,
      default: () => undefined
    },
    cellClassName: {
      type: [Function, String] as PropType<(row: Recordable, column: any, rowIndex: number) => string | string>,
      default: ""
    },
    cellStyle: {
      type: [Function, Object] as PropType<(row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties>,
      default: () => undefined
    },
    headerRowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: ""
    },
    headerRowStyle: {
      type: [Function, Object] as PropType<(row: Recordable, rowIndex: number) => Recordable | CSSProperties>,
      default: () => undefined
    },
    headerCellClassName: {
      type: [Function, String] as PropType<(row: Recordable, column: any, rowIndex: number) => string | string>,
      default: ""
    },
    headerCellStyle: {
      type: [Function, Object] as PropType<(row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties>,
      default: () => undefined
    },
    rowKey: {
      type: [String, Function] as PropType<string | ((row: any) => string)>,
      default: "id"
    },
    emptyText: {
      type: String,
      default: "No Data"
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    expandRowKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    defaultSort: {
      type: Object as PropType<{ prop: string; order: string }>,
      default: () => ({})
    },
    tooltipEffect: {
      type: String as PropType<"dark" | "light">,
      default: "dark"
    },
    tooltipOptions: {
      type: Object as PropType<
        Pick<
          ElTooltipProps,
          | "effect"
          | "enterable"
          | "hideAfter"
          | "offset"
          | "placement"
          | "popperClass"
          | "popperOptions"
          | "showAfter"
          | "showArrow"
        >
      >,
      default: () => ({
        enterable: true,
        placement: "top",
        showArrow: true,
        hideAfter: 200,
        popperOptions: { strategy: "fixed" }
      })
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: {
      type: String
    },
    summaryMethod: {
      type: Function as PropType<(param: { columns: any[]; data: any[] }) => any[]>,
      default: () => undefined
    },
    spanMethod: {
      type: Function as PropType<(param: { row: any; column: any; rowIndex: number; columnIndex: number }) => any[]>,
      default: () => undefined
    },
    selectOnIndeterminate: {
      type: Boolean,
      default: false
    },
    indent: {
      type: Number,
      default: 16
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function as PropType<(row: Recordable, treeNode: any, resolve: Function) => void>,
      default: () => undefined
    },
    treeProps: {
      type: Object as PropType<{ hasChildren?: string; children?: string; label?: string }>,
      default: () => ({ hasChildren: "hasChildren", children: "children", label: "label" })
    },
    tableLayout: {
      type: String as PropType<"auto" | "fixed">,
      default: "fixed"
    },
    scrollbarAlwaysOn: {
      type: Boolean,
      default: false
    },
    flexible: {
      type: Boolean,
      default: false
    },
    fillUp: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:pageSize", "update:currentPage", "register", "refresh"],
  setup(props, { attrs, emit, slots, expose }) {
    const elTableRef = ref<InstanceType<typeof ElTable>>()
    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit("register", tableRef?.$parent, elTableRef)
    })

    // 获取参数
    // 非proxy对象的props和attr(props中不包含的事件和属性)合集
    // const staticProps = { ...props, ...attrs }
    // proxy对象的props和attr(props中不包含的事件和属性)合集
    const activeProps = reactive({ ...toRefs(props), ...attrs })
    // 需要动态渲染的表格column
    const columns = computed(() => props.columns)
    // 需要动态绑定的pageSize， currentPage
    const pageSize = computed({
      get: () => {
        return props.pageSize
      },
      set: (val: number) => {
        emit("update:pageSize", val)
        // 触发即为ElPagination切换了pageSize，在此进行useTable的操作
      }
    })
    const currentPage = computed({
      get: () => {
        return props.currentPage
      },
      set: (val: number) => {
        emit("update:currentPage", val)
      }
    })
    // table高度是否占满的对应style
    const style = {
      flex: unref(computed(() => (props.fillUp ? 1 : "unset")))
    }
    // 获取绑定值
    //table方法
    const setProps = (setProps: TableParameterTypes = {}) => {
      // 接受普通对象需要转换为reactive对象
      let updateProps = reactive(setProps)
      Object.assign(activeProps, { ...toRefs(updateProps) })
    }

    const setColumn = (columnProps: TableSetProps[], columnsChildren?: TableColumnParameterTypes[]) => {
      const { columns } = unref(activeProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const addColumn = (column: TableColumnParameterTypes, index?: number) => {
      const { columns } = unref(activeProps)
      if (index !== void 0) {
        columns.splice(index, 0, column)
      } else {
        columns.push(column)
      }
    }

    const delColumn = (field: string) => {
      const { columns } = unref(activeProps)
      const index = columns.findIndex(item => item.field === field)
      if (index > -1) {
        columns.splice(index, 1)
      }
    }

    const refresh = () => {
      emit("refresh")
    }

    const changSize = (size: any) => {
      setProps({ size })
    }
    // 全屏
    const fullscreenRef = ref<HTMLElement | null>(null)
    const isUnFullscreen = ref(true)
    const { toggle, isFullscreen } = useFullscreen(fullscreenRef)
    const changeFullScreen = async () => {
      await nextTick()
      isUnFullscreen.value = unref(isFullscreen)
      toggle()
    }
    // 分页
    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          background: false,
          pagerCount: 7,
          layout: "sizes, prev, pager, next, jumper, ->, total",
          pageSizes: [10, 20, 30, 40, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 0
        },
        props.pagination
      )
    })
    // 多级表头table column渲染
    const renderMultiTableColumn = (columnsChildren?: TableColumnParameterTypes[]) => {
      const { align, headerAlign, showOverflowTooltip } = activeProps
      return columnsChildren.map(v => {
        if (v.hidden) return null
        let params = {
          showOverflowTooltip,
          align,
          headerAlign
        }
        return publicTableColumnsRender(v, params)
      })
    }
    // 渲染table column
    const renderTableColumn = (columnsChildren?: TableColumnParameterTypes[]) => {
      {
        const { pageSize, currentPage, align, headerAlign, showOverflowTooltip, reserveSelection } = unref(activeProps)
        return unref(columnsChildren || columns).map(v => {
          if (v.hidden) return null
          if (v.type === "index") {
            return (
              <ElTableColumn
                type="index"
                index={v.index ? v.index : (currentPage - 1) * pageSize + 1}
                align={v.align || align}
                headerAlign={v.headerAlign || headerAlign}
                label={v.label}
                fixed={v.fixed}
                width="65px"
              ></ElTableColumn>
            )
          } else if (v.type === "selection") {
            return (
              <ElTableColumn
                type="selection"
                reserveSelection={reserveSelection}
                align={align}
                headerAlign={headerAlign}
                selectable={v.selectable}
                width="50"
              ></ElTableColumn>
            )
          } else {
            let params = {
              showOverflowTooltip,
              align,
              headerAlign
            }
            return publicTableColumnsRender(v, params)
          }
        })
      }
    }
    // tableColumn 渲染主要代码
    const publicTableColumnsRender = (v: TableColumnParameterTypes, params) => {
      const props = { ...v }
      const children = v.children
      if (props?.children?.length) delete props.children
      const tableColumnSlots = {
        default: (...args: any[]) => {
          const data = args[0]
          return children && children.length
            ? renderMultiTableColumn(children)
            : props?.slots?.default
            ? props.slots.default(...args)
            : v?.formatter
            ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
            : get(data.row, v.field)
        }
      }
      if (props?.slots?.header) {
        tableColumnSlots["header"] = (...args: any[]) => props.slots.header(...args)
      }
      return (
        <ElTableColumn {...params} {...props} prop={v.field}>
          {tableColumnSlots}
        </ElTableColumn>
      )
    }
    // 暴露
    expose({
      setProps,
      setColumn,
      delColumn,
      addColumn,
      elTableRef
    })
    // render
    return () => {
      const tableSlots = {}
      if (getSlot(slots, "empty")) {
        tableSlots["empty"] = (...args: any[]) => getSlot(slots, "empty", args)
      }
      if (getSlot(slots, "append")) {
        tableSlots["append"] = (...args: any[]) => getSlot(slots, "append", args)
      }
      // 表格头部之前部分的插槽（自定义为prefix）
      const prefixSlots = {}
      if (getSlot(slots, "prefix")) {
        prefixSlots["prefix"] = (...args: any[]) => getSlot(slots, "prefix", args)
      }
      if (getSlot(slots, "search")) {
        prefixSlots["search"] = (...args: any[]) => getSlot(slots, "search", args)
      }
      //Table Setting部分插槽
      const tableSettingSlot = (...args: any[]) => getSlot(slots, "setting", args)

      return (
        <div class="vx-table" v-loading={unref(activeProps).loading}>
          <div class="vx-table__prefix">
            {Object.keys(prefixSlots).map((key: string) => {
              return <div>{prefixSlots[key]?.()}</div>
            })}
          </div>
          {/* 需要全屏的部分 */}
          <div
            class={unref(isUnFullscreen) ? "vx-table__fullscreen" : "vx-table__fullscreen fullscreen-padding"}
            ref={fullscreenRef}
          >
            {getSlot(slots, "setting") ? (
              <TableSetting
                onChangeSize={changSize}
                onRefresh={refresh}
                onChangeFullScreen={changeFullScreen}
                slot={tableSettingSlot()}
                data={unref(props.columns)}
              />
            ) : (
              void 0
            )}
            <ElTable ref={elTableRef} {...unref(activeProps)} data={props.data} style={style}>
              {{ default: () => renderTableColumn(), ...tableSlots }}
            </ElTable>
            {activeProps.pagination ? (
              <div class="vx-table__pagination">
                <ElPagination
                  v-model:pageSize={pageSize.value}
                  v-model:currentPage={currentPage.value}
                  {...unref(pagination)}
                ></ElPagination>
              </div>
            ) : (
              void 0
            )}
          </div>
        </div>
      )
    }
  }
})
</script>
<style lang="scss" scoped>
@use "./Table.scss";
</style>

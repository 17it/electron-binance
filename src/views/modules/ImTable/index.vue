<template>
  <AffixedTable
    ref="tableRef"
    v-loading="loading"
    :class="table.data.length ? '' : 'im-table-empty'"
    :sticky-top="96"
    selector=".app-scrollbar-wrapper"
    size="medium"
    :data="table.data"
    v-bind="table.attrs"
    border
    v-on="table.listeners"
  >
    <div slot="empty">
      <el-empty :description="emptyDesc"></el-empty>
    </div>
    <template v-for="item in tableList">
      <el-table-column
        v-if="item.type === 'selection'"
        :key="item.label"
        type="selection"
        :prop="item.prop"
        :label="item.label"
        v-bind="item.attrs"
      ></el-table-column>
      <el-table-column
        v-else
        :key="item.label"
        :prop="item.prop"
        :label="item.label"
        v-bind="item.attrs"
      >
        <template slot="header">
          <slot :name="item.headSlot" :item="item" />
        </template>
        <template slot-scope="scope">
          <!--序号-->
          <template v-if="item.type === 'index'">
            <p v-if="pageSize && currentPage">
              {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
            </p>
            <p v-else>{{ scope.$index + 1 }}</p>
          </template>
          <!--自定义slot-->
          <template v-else-if="item.type === 'slot'">
            <slot
              :name="item.slot"
              :row="scope.row"
              :prop="item.prop"
              :$index="scope.$index"
            />
          </template>
          <!--枚举-->
          <template v-else-if="item.type === 'enum'">
            {{ getEnumLabel(item.enumKey, scope.row[item.prop]) }}
          </template>
          <!--枚举options-->
          <template v-else-if="item.type === 'enumOption'">
            {{ scope.row[item.prop] | objFilter(item.attrs.options) }}
          </template>
          <!--手机号 - 脱敏处理-->
          <template v-else-if="item.type === 'mobile'">
            {{ formatMobile(scope.row, item.prop) }}
          </template>
          <!--月份-->
          <template v-else-if="item.type === 'month'">
            {{ scope.row[item.prop] | setMonth(item.prop) }}
          </template>
          <!--日期-->
          <template v-else-if="item.type === 'date'">
            {{ scope.row[item.prop] | setDate(item.prop) }}
          </template>
          <!--日期时间-->
          <template v-else-if="item.type === 'datetime'">
            {{ scope.row[item.prop] | setDateTime(item.prop) }}
          </template>
          <!--自定义filter-->
          <template v-else-if="item.type === 'customFilter'">
            <div
              @click="
                item.onClick && item.onClick(scope.$index, scope.row, $event)
              "
              v-html="
                customFilter(
                  scope.row[item.prop],
                  item,
                  scope.row,
                  scope.$index
                )
              "
            />
          </template>
          <!--else-->
          <template v-else>
            <span :style="item.style">
              {{ getCurrentProp(scope.row, item.prop) || '-' }}
            </span>
          </template>
        </template>
      </el-table-column>
    </template>
  </AffixedTable>
</template>

<script>
import { mapGetters } from 'vuex'
import AffixedTable from '../AffixedTable'

export default {
  name: 'ImTable',

  filters: {
    objFilter(val, options) {
      let obj = ''
      options.forEach((item) => {
        if (val === item.value) {
          obj = item.label
        }
      })
      return obj
    },
    /**
     * 过滤器,对应有值与title对应关系的数据进行映射
     */
    filterOperation(val, map, style) {
      if (val === null) {
        return '-'
      }
      for (let i = 0; i < map.length; i++) {
        const cur = map[i]
        if (cur.value.toString() === val.toString()) {
          if (style) {
            return cur.style
          }
          return cur.label
        }
      }
      return '-'
    },

    /**
     * 将时间戳成日期 2017-02
     */
    setMonth(val) {
      let newMonth = ''
      if (val) {
        val = val.replace(/-/g, '/')
        const date = new Date(val)
        if (!date) {
          return '-'
        }
        const YYYY = date.getFullYear()
        const mm =
          date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1)
        newMonth = YYYY + '-' + mm
      }
      return newMonth || '-'
    },

    /**
     * 过滤器，将时间戳成日期 2017-02-09
     */
    setDate(val) {
      let newdate = ''
      if (val) {
        val = val.replace(/-/g, '/')
        const date = new Date(val)
        if (!date) {
          return '-'
        }
        const YYYY = date.getFullYear()
        const mm =
          date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1)
        const dd = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
        newdate = YYYY + '-' + mm + '-' + dd
      }
      return newdate || '-'
    },

    /**
     * 过滤器，将时间戳转成时间格式 2017-02-09 20:22:14
     */
    setDateTime(val) {
      let newdate = ''
      if (val) {
        val = val.replace(/-/g, '/')
        const date = new Date(val)
        if (!date) {
          return '-'
        }
        const YYYY = date.getFullYear()
        const mm =
          date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1)
        const dd = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
        const hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
        const MM =
          date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
        const ss =
          date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
        newdate = YYYY + '-' + mm + '-' + dd + ' ' + hh + ':' + MM + ':' + ss
      }
      return newdate || '-'
    }
  },

  components: {
    AffixedTable
  },

  props: {
    table: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyDesc: {
      type: String,
      default: '暂无数据'
    },
    pageSize: {
      type: Number,
      default: null
    },
    currentPage: {
      type: Number,
      default: null
    }
  },

  computed: {
    ...mapGetters(['enums']),
    tableList() {
      return this.table.tableItems.filter((item) => {
        return !item.hidden
      })
    }
  },

  watch: {
    // 修复table表格偶尔错位问题
    'table.data': {
      handler() {
        this.$nextTick(() => {
          if (
            this.$refs.tableRef &&
            this.$refs.tableRef.$children &&
            this.$refs.tableRef.$children[0] &&
            this.$refs.tableRef.$children[0].doLayout
          ) {
            this.$refs.tableRef.$children[0].doLayout()
          }
        })
      },
      deep: true
    }
  },

  methods: {
    // 金额千分位展示
    numberThousandth(num) {
      const nums = num.toString().split('.')
      const rd = nums[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')

      return `${rd}${nums[1] ? '.' + nums[1] : ''}`
    },

    getEnumLabel(enumKey, value) {
      const enumItem = this.enums[enumKey] || []
      for (let i = 0; i < enumItem.length; i++) {
        const item = enumItem[i]
        if (item.value === value) {
          return item.label
        }
      }
      return '-'
    },

    /**
     * 获取当前属性，如果通过.连接，需要下方属性
     * 目前只支持普通属性的展示使用
     */
    getCurrentProp(row, prop) {
      const resArr = prop.split('.')
      let result = ''
      if (prop.indexOf('.') === -1) {
        return row[prop]
      } else {
        result = row[resArr[0]]
        for (let i = 1; i < resArr.length; i++) {
          result = result && result[resArr[i]]
        }
        return result
      }
    },

    // 手机号 脱敏处理
    formatMobile(row, prop) {
      const str = row[prop] || ''

      return `${str.substr(0, 3)}****${str.substr(7)}`
    },

    btnList(data, scope) {
      return data.filter((item) => {
        return item.isNot
          ? item.value && item.value.indexOf(scope.row[item.prop]) === -1
          : item.value && item.value.indexOf(scope.row[item.prop]) > -1
      })
    },

    /**
     * 自定义过滤器
     */
    customFilter(val, item, row, idx) {
      if (item && item.filter) {
        return item.filter(val, row, idx)
      } else {
        return val
      }
    },

    selectionChange($event, select) {
      if (select && select.selectChange) {
        select.selectChange($event)
      }
    },

    getTableInstance() {
      return this.$refs.tableRef.getTableInstance()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

// 使表格兼容safari，不错位
/deep/.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}

/deep/.el-table--border {
  &:not(.el-table--group) {
    border: 0;

    &::after {
      width: 0;
    }

    th,
    td {
      border-right: 0;
    }

    .cell {
      color: $textColor;
    }

    th {
      height: 48px;
      font-weight: bold;
      background: #FAFAFA;

      .cell {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        // &::before {
        //   position: absolute;
        //   top: 4px;
        //   bottom: 4px;
        //   left: -1px;
        //   width: 1px;
        //   border-right: 2px #ccc dotted;
        //   content: '';
        // }
      }
    }

    th:first-child > .cell {
      &::before {
        display: none;
      }
    }

    // // 列表里的每一项
    // .el-table__body {
    //   td.el-table__cell {
    //     .cell {
    //       line-height: 36px;
    //     }
    //   }
    // }
  }

  // 表格里的操作按钮 如果有操作按钮，则需要设定一个宽度
  .el-table__cell {
    .el-button {
      margin-right: 5px;
      margin-left: 5px;
    }

    .el-button + .el-button {
      margin-left: 5px;
    }
  }
}

/deep/.el-table__footer-wrapper {
  tbody td.el-table__cell {
    background: rgba(255, 250, 236, 0.5);
    color: #000;
  }
}
/deep/.el-table__fixed-footer-wrapper{
  tbody td.el-table__cell {
    background: rgba(255, 250, 236, 0.5);
    color: #000;
  }
}

.im-table-empty {
  ::v-deep {
    .el-table__empty-block {
      width: 100% !important;
    }
  }
}
</style>

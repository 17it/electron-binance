<template>
  <div v-show="total !== 0" class="mt-4 text-right">
    <el-pagination
      background
      :layout="layout"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :current-page="currentPage"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
const defaultPageSize = 10
const defaultCurrentPage = 1
export default {
  name: 'ImPagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: defaultCurrentPage
    },
    pageSize: {
      type: Number,
      default: defaultPageSize
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  watch: {
    /**
     * 如果总页数小于当前页数,那么需要把当前页数变成最大页数
     * 总页数为0,则定位到第一页
     */
    total(totalValue) {
      const totalPage = Math.ceil(totalValue / this.pageSize)
      if (totalPage < this.currentPage) {
        this.handleCurrentChange(totalPage === 0 ? 1 : totalPage)
      }
    }
  },
  methods: {
    /**
     * 每页个数发生变化事件
     */
    handleSizeChange(val) {
      this.$emit('update:pageSize', val)
      this.$emit('update:currentPage', 1)
      this.$emit('change')
    },

    /**
     * 当前页码发生变化事件
     */
    handleCurrentChange(val) {
      this.$emit('update:currentPage', val)
      this.$emit('change')
    },

    /**
     *  重置
     */
    reset() {
      this.$emit('update:pageSize', defaultPageSize)
      this.$emit('update:currentPage', defaultCurrentPage)
    }
  }
}
</script>

<template>
  <AddOrEditForPaper
    :add-item="addFormItem"
    :object-code="objectCode"
    :get-detail="getFormDetail"
    :update-item="addFormItem"
    :data-changed.sync="dataChanged"
    @goListPage="goListPage"
  ></AddOrEditForPaper>
</template>

<script>
import { addFormItem, getFormDetail } from '@/api/paper'
import AddOrEditForPaper from '@/views/components/PaperContent/AddOrEditForPaper'

export default {
  name: 'FormAddOrEdit--nocache',
  components: {
    AddOrEditForPaper
  },
  beforeRouteLeave(to, from, next) {
    if (!this.dataChanged) {
      this.$store.commit('app/OPEN_SIDEBAR')
      next()
      return
    }
    this.$confirm('检测到有未保存的数据, 是否离开当前页面？', '提示', {
      type: 'warning',
      customClass: 'deleteConfirm',
      confirmButtonText: '确定离开',
      cancelButtonText: '点错了'
    })
      .then(() => {
        this.$store.commit('app/OPEN_SIDEBAR')
        next()
      })
      .catch((action) => {
        return false
      })
  },
  data() {
    return {
      dataChanged: false
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(val) {
        this.objectCode = val?.objectCode
      }
    }
  },
  methods: {
    addFormItem,
    getFormDetail,
    goListPage() {
      this.$router.replace({ name: 'BaseFormList' })
    }
  }
}
</script>

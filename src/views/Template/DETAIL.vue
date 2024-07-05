<template>
  <ImWrapper>
    <div slot="header" class="bg-white rounded p-6 mt-2">
      <div class="header-container">
        <span class="header-text">产品编号: {{ details.productNum }}</span>
        <div>
          <el-button @click="deleteItem">删 除</el-button>
          <el-button type="primary" @click="editItem">编 辑</el-button>
        </div>
      </div>
    </div>

    <ImCard>
      <span slot="title">产品信息</span>
      <el-descriptions size="medium" label-class-name="descriptionLabelClass">
        <el-descriptions-item label="产品名称">{{ details.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="合并规格">
          {{ details.skuId || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="业务类型">
          <EnumShow enum-key="businessType" :enum-value="details.businessType"></EnumShow>
        </el-descriptions-item>
        <el-descriptions-item label="材料类别">
          <EnumShow enum-key="category" :enum-value="details.category"></EnumShow>
        </el-descriptions-item>
        <el-descriptions-item label="产品类型">
          <EnumShow enum-key="type" :enum-value="details.type"></EnumShow>
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions size="medium" label-class-name="descriptionLabelClass">
        <el-descriptions-item :span="3" label="产品介绍">
          {{ details.indication || '-' }}
        </el-descriptions-item>
        <el-descriptions-item :span="3" label="产品图片">
          <ImageShow :src="details.imageUrl"></ImageShow>
        </el-descriptions-item>
      </el-descriptions>
    </ImCard>
    <ImCard>
      <span slot="title">关联项目</span>
      <ImTable :loading="loading" :table="tableConfig">
        <template slot="projectCode" slot-scope="scope">
          <el-button type="text" style="font-size:14px" @click="viewProjectDetail(scope.row.objectCode)">{{ scope.row.projectCode }}</el-button>
        </template>
      </ImTable>
      <ImPagination ref="ImPagination" :page-size.sync="pageSize" :current-page.sync="currentPage" :total="total" @change="getList"></ImPagination>
    </ImCard>
  </ImWrapper>
</template>

<script>
import { getProductDetail, deleteProductItem } from '@/api/product'
import { getProdoutProjectList } from '@/api/project'
import ImageShow from '@/views/components/Show/ImageShow'
import EnumShow from '@/views/components/Show/EnumShow'

export default {
  name: 'QuestionNaireStatistics--nocache',
  components: {
    EnumShow,
    ImageShow
  },
  data() {
    return {
      tableConfig: {
        data: [],
        tableItems: [
          {
            prop: 'projectCode',
            label: '项目编号',
            type: 'slot',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '120'
            },
            slot: 'projectCode'
          },
          {
            prop: 'name',
            label: '项目名称',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '120'
            }
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'datetime',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '120'
            }
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            type: 'datetime',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '120'
            }
          }
        ]
      },
      details: {},
      objectCode: this.$route.query.objectCode,
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  created() {
    this.getItemDetail()
    this.getList()
  },
  methods: {
    viewProjectDetail(objectCode) {
      this.$router.push({ name: 'ProjectDetail', query: { objectCode } })
    },

    getItemDetail() {
      getProductDetail({ objectCode: this.objectCode }).then((res) => {
        if (res.code === 200) {
          this.details = res.data || {}
        }
      })
    },

    editItem() {
      this.$router.push({ name: 'ProductAddOrEdit', query: { objectCode: this.objectCode } })
    },

    deleteItem($index, record) {
      this.$confirm('确定要删除该项吗？', '提示', {
        type: 'warning',
        customClass: 'deleteConfirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteProductItem({ objectCode: this.objectCode }).then((res) => {
            if (res.code === 200) {
              this.$message.success('操作成功！')
              this.goListPage()
            } else {
              this.$message.error(res.message)
            }
          })
        })
        .catch(() => {
        })
    },

    goListPage() {
      this.$router.replace({ name: 'ProductList' })
    },
    onslotClick(objectCode) {
      this.$router.push({ name: 'ProjectDetail', query: { objectCode: objectCode } })
    },
    getList() {
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        productCode: this.objectCode
      }
      this.loading = true
      getProdoutProjectList(params)
        .then((res) => {
          this.loading = false
          if (res.code === 200) {
            this.total = res.data.totalCount
            this.tableConfig.data = res.data.list || []
          }
        })
        .catch((_) => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-text {
    color: #000;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }
}
</style>

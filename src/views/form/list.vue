<template>
  <ImWrapper>
    <ImSearchArea>
      <ImForm ref="ImForm" :form="formConfig"></ImForm>
    </ImSearchArea>
    <ImTableArea>
      <div class="mb-4">
        <el-button type="primary" @click="addItem">新建表单</el-button>
      </div>
      <ImTable :loading="loading" :table="tableConfig">
        <template slot="operate" slot-scope="scope">
          <el-button size="medium" type="text" @click="viewItem(scope.row)">查看</el-button>
          <el-button size="medium" type="text" @click="editItem(scope.row)">编辑</el-button>
          <!-- <el-button size="medium" type="text" @click="deleteItem(scope.row)">删除</el-button> -->
        </template>
      </ImTable>
      <ImPagination
        ref="ImPagination"
        :page-size.sync="pageSize"
        :current-page.sync="currentPage"
        :total="total"
        @change="getList"
      ></ImPagination>
    </ImTableArea>
  </ImWrapper>
</template>

<script>
import { getFormList, deleteFormItem } from '@/api/paper'

export default {
  name: 'FormList',
  data() {
    return {
      formConfig: {
        column: 3,
        attrs: {
          labelWidth: '100px'
        },
        props: {
          name: undefined
        },
        formItems: [
          {
            type: 'ImInput',
            prop: 'name',
            label: '表单名称'
          },
          {
            type: 'ImButton',
            notInCol: true,
            attrs: {
              style: 'float: right;',
              options: [
                {
                  label: '重 置',
                  attrs: {
                    type: 'default'
                  },
                  listeners: {
                    click: this.resetForm
                  }
                },
                {
                  label: '查 询',
                  attrs: {
                    type: 'primary'
                  },
                  listeners: {
                    click: this.search
                  }
                }
              ]
            }
          }
        ]
      },
      tableConfig: {
        data: [],
        tableItems: [
          {
            prop: 'name',
            label: '表单名称',
            attrs: {
              fixed: 'left',
              'show-overflow-tooltip': true,
              'min-width': '180'
            }
          },
          {
            prop: 'createBy',
            label: '创建人',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '100'
            }
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'datetime',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '180'
            }
          },
          {
            prop: 'updateBy',
            label: '最近更新人',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '100'
            }
          },
          {
            prop: 'updateTime',
            label: '最近更新时间',
            type: 'datetime',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '180'
            }
          },
          {
            prop: 'bizCodeType',
            type: 'enumOption',
            label: '所属业务',
            attrs: {
              'show-overflow-tooltip': true,
              'min-width': '100',
              options: [{
                value: '1',
                label: '科研活动'
              }, {
                value: '2',
                label: '调查问卷'
              }, {
                value: '3',
                label: '图文发布'
              }]
            }
          },
          {
            prop: '',
            label: '操作',
            type: 'slot',
            attrs: {
              fixed: 'right',
              width: '130'
            },
            slot: 'operate'
          }
        ]
      },
      loading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  created() {
    this.getList()
    this.inited = true
  },
  activated() {
    if (this.inited) {
      this.inited = false
    } else {
      this.getList()
    }
  },
  methods: {
    viewItem(record) {
      this.$router.push({ name: 'BaseFormDetail', query: { objectCode: record.objectCode } })
    },

    editItem(record) {
      this.$router.push({ name: 'BaseFormAddOrEdit', query: { objectCode: record.objectCode } })
    },

    addItem(record) {
      this.$router.push({ name: 'BaseFormAddOrEdit' })
    },

    deleteItem(record) {
      this.$confirm('确定要删除该项吗？', '提示', {
        type: 'warning',
        customClass: 'deleteConfirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteFormItem({ formCode: record.objectCode }).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功！')
              this.search()
            } else {
              this.$message.error(res.message)
            }
          })
        })
        .catch(() => {
        })
    },

    /**
     * 重置表单
     */
    resetForm() {
      this.$refs.ImForm.reset()
      this.$refs.ImPagination.reset()
      this.getList()
    },

    /**
     * 搜索按钮点击事件，回到第一页
     */
    search() {
      this.$refs.ImPagination.reset()
      this.getList()
    },

    /**
     * 获取列表
     */
    getList() {
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        ...this.formConfig.props
      }
      this.loading = true
      getFormList(params)
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
/deep/ .el-table__header-wrapper {
  transform: none !important;
}

/deep/ .el-table__fixed-header-wrapper {
  transform: none !important;
}
</style>

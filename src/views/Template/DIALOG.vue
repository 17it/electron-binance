<template>
  <ImDialog
    :visible.sync="dialogVisible"
    :title="objectCode ? '编辑关键词回复' : '新建关键词回复'"
    @closeDialog="closeDialog"
    @submit="submitForm"
  >
    <ImForm ref="ImForm" :form="formConfig"></ImForm>
  </ImDialog>
</template>

<script>
import { addItem, getDetail, updateItem } from '@/api/$1'
export default {
  name: 'Dialog',
  data() {
    return {
      formConfig: {
        attrs: {
          labelWidth: '80px',
          labelPosition: 'right'
        },
        props: {
          ruleName: undefined,
          keywords: [],
          content: undefined
        },
        formItems: [
          {
            type: 'ImInput',
            prop: 'ruleName',
            label: '规则名称',
            attrs: {
              maxLength: 60,
              showWordLimit: true
            }
          },
          {
            type: 'ImInput',
            prop: 'content',
            label: '回复内容',
            attrs: {
              type: 'textarea',
              rows: 4,
              size: 'medium',
              maxLength: 600,
              showWordLimit: true
            }
          }
        ]
      },
      objectCode: undefined,
      dialogVisible: false
    }
  },
  methods: {
    add() {
      this.objectCode = undefined
      this.dialogVisible = true
      if (this.$refs.ImForm) {
        this.$refs.ImForm.reset()
      }
    },

    edit(objectCode) {
      this.objectCode = objectCode
      this.dialogVisible = true
      this.getItemDetail()
    },

    getItemDetail() {
      getDetail({ objectCode: this.objectCode }).then((res) => {
        if (res.code === 200) {
          const props = this.formConfig.props
          const keys = Object.keys(props)
          // 直接遍历进行赋值，特殊属性需要单独拿出来处理
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            props[key] = res.data[key] || undefined
          }
        }
      })
    },

    submitForm() {
      this.$refs.ImForm.validate((valid) => {
        if (!valid) {
          this.$message.warning('请检查表单项！')
          return
        }
        const data = {
          ...this.formConfig.props
        }
        if (this.objectCode) {
          data.objectCode = this.objectCode
          updateItem(data).then((res) => {
            if (res.code === 200) {
              this.$message.success('更新成功！')
              this.$emit('update')
              this.closeDialog()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          addItem(data).then((res) => {
            if (res.code === 200) {
              this.$message.success('操作成功！')
              this.$emit('add')
              this.closeDialog()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    closeDialog() {
      this.$refs.ImForm.reset()
      this.dialogVisible = false
    }
  }
}
</script>

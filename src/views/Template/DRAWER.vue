<template>
  <ImDrawer :visible.sync="drawerVisible" :title="objectCode ? '编辑标签' : '新建标签'" @closeDrawer="closeDrawer" @submit="submitForm">
    <ImForm ref="ImForm" :form="formConfig">
      <h3 slot="infoSlot" class="gyl-title"><i class="el-icon-s-order" />标签信息</h3>
    </ImForm>
  </ImDrawer>
</template>

<script>
import { addTagItem, getTagDetail, updateTagItem } from '@/api/tag'

export default {
  name: 'AddOrEdit',
  data() {
    return {
      formConfig: {
        attrs: {
          labelWidth: '140px',
          labelPosition: 'right'
        },
        props: {
          name: undefined,
          type: undefined
        },
        formItems: [
          {
            type: 'ImSlot',
            notInForm: true,
            slots: {
              firstSlot: 'infoSlot'
            }
          },
          {
            type: 'ImInput',
            prop: 'name',
            label: '标签名称',
            rules: [{ required: true, message: '请输入标签名称' }]
          },
          {
            type: 'ImEnumSelect',
            prop: 'type',
            label: '标签类型',
            rules: [{ required: true, message: '请选择标签类型' }],
            attrs: {
              enumKey: 'tagType',
              clearable: true,
              class: 'w-full'
            }
          }
        ]
      },
      objectCode: undefined,
      drawerVisible: false
    }
  },
  methods: {
    add() {
      this.objectCode = undefined
      this.drawerVisible = true
    },

    edit(objectCode) {
      this.objectCode = objectCode
      this.drawerVisible = true
      this.getItemDetail()
    },

    getItemDetail() {
      getTagDetail({ objectCode: this.objectCode }).then((res) => {
        if (res.code === 200 && res.data) {
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
          updateTagItem(data).then((res) => {
            if (res.code === 200) {
              this.$message.success('更新成功！')
              this.$emit('update')
              this.closeDrawer()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          addTagItem(data).then((res) => {
            if (res.code === 200) {
              this.$message.success('操作成功！')
              this.$emit('add')
              this.closeDrawer()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    closeDrawer() {
      this.$refs.ImForm.reset()
      this.drawerVisible = false
    }
  }
}
</script>

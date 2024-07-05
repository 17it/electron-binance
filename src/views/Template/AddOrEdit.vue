<template>
  <ImWrapper>
    <div class="bg-white p-4 mb-[32px]">
      <ImForm ref="ImForm" :form="formConfig">
        <CardHeader slot="infoSlot" class="-mt-4" text="素材信息"></CardHeader>
        <FormSplit slot="split"></FormSplit>
        <CardHeader slot="moreInfo" text="更多信息"></CardHeader>
      </ImForm>
    </div>
    <FixedBottom>
      <el-button @click="closeCurrent">取 消</el-button>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </FixedBottom>
  </ImWrapper>
</template>

<script>
// import { getDetail, editResources, resourcesCommit } from '@/api/resources'
import FixedBottom from '@/views/components/FormWidgets/FixedBottom'
import CardHeader from '@/views/components/FormWidgets/CardHeader'
import FormSplit from '@/views/components/FormWidgets/FormSplit'

export default {
  name: 'GoodsAddOrEdit-noCache',
  components: {
    CardHeader,
    FormSplit,
    FixedBottom
  },
  data() {
    return {
      objectCode: this.$route.query.objectCode,
      formConfig: {
        column: 3,
        gutter: 56,
        attrs: {
          labelWidth: '140px',
          labelPosition: 'top'
        },
        props: {
          author: '',
          introduction: '',
          name: '',
          type: undefined,
          coverUrl: '',
          fileUrl: ''
        },
        formItems: [
          {
            type: 'ImSlot',
            notInForm: true,
            slots: {
              slot: 'infoSlot'
            }
          },
          {
            type: 'ImInput',
            prop: 'author',
            label: '作者',
            rules: [{ required: true, message: '请输入作者' }],
            attrs: {
              maxLength: 32
            }
          },
          {
            type: 'ImInput',
            prop: 'name',
            label: '名称',
            rules: [{ required: true, message: '请输入名称' }],
            attrs: {
              maxLength: 32
            }
          },
          {
            type: 'ImSelect',
            prop: 'gender',
            label: '性别',
            rules: [{ required: true, message: '请选择性别' }],
            attrs: {
            }
          },
          {
            type: 'ImInput',
            prop: 'introduction',
            label: '简介',
            span: 24,
            rules: [{ required: true, message: '请输入简介' }],
            attrs: {
              type: 'textarea',
              style: 'width: 66%',
              rows: 6,
              maxLength: 64,
              showWordLimit: true
            }
          },
          {
            type: 'ImSlot',
            notInForm: true,
            slots: {
              slot: 'split'
            }
          },
          {
            type: 'ImSlot',
            notInForm: true,
            slots: {
              slot: 'moreInfo'
            }
          },
          {
            type: 'ImImgUpload',
            prop: 'coverUrl',
            label: '视频封面',
            rules: [{ required: true, message: '请上传视频封面' }]
          },
          {
            type: 'ImVideoUpload',
            prop: 'fileUrl',
            label: '视频文件',
            rules: [{ required: true, message: '请选择视频文件' }]
          }
        ]
      }
    }
  },
  created() {
    if (this.objectCode) {
      this.getItemDetail()
    }
  },
  methods: {
    getItemDetail() {
      // getDetail({ objectCode: this.objectCode }).then((res) => {
      //   if (res.code === 200) {
      //     const props = this.formConfig.props
      //     const keys = Object.keys(props)
      //     // 直接遍历进行赋值，特殊属性需要单独拿出来处理
      //     for (let i = 0; i < keys.length; i++) {
      //       const key = keys[i]
      //       props[key] = res.data[key] || undefined
      //     }
      //   }
      // })
    },

    submitForm(callback) {
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
          // editResources(data).then((res) => {
          //   if (res.code === 200) {
          //     this.$message.success('更新成功！')
          //     this.closeCurrent()
          //   } else {
          //     this.$message.error(res.message)
          //   }
          // })
        } else {
          // resourcesCommit(data).then((res) => {
          //   if (res.code === 200) {
          //     this.$message.success('操作成功！')
          //     this.closeCurrent()
          //   } else {
          //     this.$message.error(res.message)
          //   }
          // })
        }
      })
    },

    closeCurrent() {
      this.$refs.ImForm.reset()
      this.$router.replace({ name: 'ResourcesList' })
    }
  }
}
</script>

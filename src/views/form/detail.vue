<template>
  <ImWrapper>
    <div slot="header" class="bg-white rounded p-6 mt-2 header">
      <div class="header-container mb-4">
        <span class="header-text">表单编号: {{ details.formNo }}</span>
        <div>
          <el-button type="primary" @click="editItem">编辑</el-button>
        </div>
      </div>
      <el-descriptions size="medium" label-class-name="descriptionLabelClass">
        <el-descriptions-item label="表单名称">
          {{ details.name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建人">
          {{ details.createBy || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ details.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="最近更新人">
          {{ details.updateBy || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="最近更新时间">
          {{ details.updateTime }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-card class="box-card">
      <div slot="header">
        <span class="headertext">表单内容</span>
      </div>
      <PaperContent :is-detail="true" :paper-config="paperConfig" :question-list.sync="questionList"></PaperContent>
    </el-card>
  </ImWrapper>
</template>

<script>
import { getFormDetail } from '@/api/paper'
import PaperContent from '@/views/components/PaperContent/index'

export default {
  name: 'PaperDetail--nocache',
  components: {
    PaperContent
  },
  data() {
    return {
      details: {},
      questionList: [],
      paperConfig: {
        paperName: '未命名表单'
      },
      objectCode: this.$route.query.objectCode
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    editItem() {
      this.$router.push({ name: 'BaseFormAddOrEdit', query: { objectCode: this.objectCode } })
    },
    getDetails() {
      getFormDetail({ objectCode: this.objectCode }).then(res => {
        if (res.code === 200) {
          const resData = res.data || {}
          this.details = resData
          this.paperConfig = resData
          this.questionList = resData.formItemList || []
        }
      })
    },

    closeCurrent() {
      this.$router.push({ name: 'BaseFormList' })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  min-width: 890px;
}

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

.box-card {
  min-width: 850px;
  margin-bottom: 16px;

  .headertext {
    color: #000;
    font-weight: 600;
    font-size: 16px;
  }
}
</style>

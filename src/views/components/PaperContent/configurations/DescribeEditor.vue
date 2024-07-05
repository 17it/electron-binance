<template>
  <div>
    <p style="margin-bottom: 8px">表单描述</p>
    <div class="inputArea">
      <el-input v-model="myValue" class="input" size="medium" placeholder="请输入" :maxlength="question.extend.subjectLimit" :show-word-limit="!!question.extend.subjectLimit" @input="onUpdate"></el-input>
      <svg-icon v-if="type === 'richTextArea'" class="icon" title="富文本编辑器" icon-class="editor-icon" @click="openDialog('1')"></svg-icon>
    </div>
    <p style="margin-bottom: 8px; margin-top: 12px">
      题干说明
      <el-switch v-model="showStemInfo" active-value="1" inactive-value="2" @change="onUpdate"> </el-switch>
    </p>
    <div class="inputArea">
      <el-input v-model="stemInfo" type="textarea" :rows="4" class="input" size="medium" placeholder="请输入" :maxlength="question.extend.stemInfoLimit" :show-word-limit="!!question.extend.stemInfoLimit" @input="onUpdate"></el-input>
      <svg-icon v-if="stemInfoType === 'richTextArea'" class="icon" title="富文本编辑器" icon-class="editor-icon" @click="openDialog('2')"></svg-icon>
    </div>
    <ImDialog
      :visible.sync="dialogVisible"
      title="表单描述"
      height="440px"
      :close-on-click-modal="false"
      @closeDialog="closeDialog"
      @submit="submitForm"
    >
      <RichTextArea v-if="dialogVisible" v-model="richTextInfo"></RichTextArea>
    </ImDialog>
  </div>
</template>

<script>
import RichTextArea from '@/views/components/RichTextArea'
export default {
  components: {
    RichTextArea
  },
  props: {
    question: {
      type: Object,
      default() {
        return {
          subject: ''
        }
      }
    }
  },
  data() {
    return {
      myValue: undefined,
      type: 'richTextArea',
      dialogType: '1',
      dialogVisible: false,
      richTextInfo: '',
      stemInfo: '',
      showStemInfo: '1',
      stemInfoType: 'richTextArea'
    }
  },
  watch: {
    'question.subject': {
      immediate: true,
      handler() {
        this.setMyValue()
      }
    },
    'question.extend.subjectType': {
      immediate: true,
      handler() {
        this.setType()
      }
    },
    'question.extend.showStemInfo': {
      immediate: true,
      handler() {
        this.setShowStemInfo()
      }
    },
    'question.extend.stemInfo': {
      immediate: true,
      handler() {
        this.setStemInfo()
      }
    },
    'question.extend.stemInfoType': {
      immediate: true,
      handler() {
        this.setStemInfoType()
      }
    }
  },
  methods: {
    setMyValue() {
      this.myValue = this?.question?.subject
    },

    setType() {
      this.type = this?.question?.extend?.subjectType
    },

    setStemInfo() {
      this.stemInfo = this?.question?.extend?.stemInfo
    },

    setShowStemInfo() {
      this.showStemInfo = this?.question?.extend?.showStemInfo
    },

    setStemInfoType() {
      this.stemInfoType = this?.question?.extend?.stemInfoType
    },

    onUpdate() {
      this.$set(this.question, 'subject', this.myValue)
      this.$set(this.question.extend, 'stemInfo', this.stemInfo)
      this.$set(this.question.extend, 'showStemInfo', this.showStemInfo)
    },

    /**
     * 打开弹窗
     */
    openDialog(type) {
      this.dialogVisible = true
      this.dialogType = type
      if (type === '1') {
        this.richTextInfo = this.myValue
      } else {
        this.richTextInfo = this.stemInfo
      }
    },

    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.dialogVisible = false
      this.richTextInfo = ''
    },

    /**
     * 提交表单
     */
    submitForm() {
      if (this.dialogType === '1') {
        this.myValue = this.richTextInfo
      } else {
        this.stemInfo = this.richTextInfo
      }
      this.onUpdate()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.inputArea {
  display: flex;
  gap: 4px;
  align-items: center;

  .input {
    flex: 1;
  }
  /deep/ .el-input__inner {
    padding-right: 55px;
  }

  .icon {
    cursor: pointer;
    width: 20px;
    height: 20px;
    color: #909399;
  }
}
</style>

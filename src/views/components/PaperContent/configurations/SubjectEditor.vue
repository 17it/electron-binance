<template>
  <div>
    <p style="margin-bottom: 8px">表单描述</p>
    <div class="inputArea">
      <el-input v-model="myValue" class="input" size="medium" placeholder="请输入" :maxlength="question.subjectLimit" :show-word-limit="!!question.subjectLimit" @input="onUpdate"></el-input>
      <svg-icon v-if="type === 'richTextArea'" class="icon" title="富文本编辑器" icon-class="editor-icon" @click="openDialog"></svg-icon>
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
      dialogVisible: false,
      richTextInfo: ''
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
    }
  },
  methods: {
    setMyValue() {
      this.myValue = this?.question?.subject
    },

    setType() {
      this.type = this?.question?.extend?.subjectType
    },

    onUpdate() {
      this.$set(this.question, 'subject', this.myValue)
    },

    /**
     * 打开弹窗
     */
    openDialog() {
      this.dialogVisible = true
      this.richTextInfo = this.myValue
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
      this.myValue = this.richTextInfo
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

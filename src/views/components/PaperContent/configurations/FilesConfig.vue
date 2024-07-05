<template>
  <div>
    <p class="header-wrap" style="margin-bottom: 8px">
      附件格式
    </p>
    <div v-if="question.extend && question.extend.fileType === 'multiple'">
      <el-checkbox-group v-model="fileAcceptValue" @change="onUpdateAccept">
        <el-checkbox label=".pdf" :disabled="checkboxDisabled">pdf</el-checkbox>
        <el-checkbox label=".doc,.docx" :disabled="checkboxDisabled">word</el-checkbox>
        <el-checkbox label=".zip,.rar" :disabled="checkboxDisabled">zip/rar</el-checkbox>
        <el-checkbox label=".mp4,.m3u8,.avi,.mov" :disabled="checkboxDisabled">视频</el-checkbox>
        <el-checkbox label=".jpg,.jpeg,.png,.gif" :disabled="checkboxDisabled">图片</el-checkbox>
        <el-checkbox label=".pdf,.doc,.docx,.zip,.rar,.mp4,.m3u8,.avi,.mov,.jpg,.jpeg,.png,.gif" @change="changeAll">不限</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-else>
      <el-radio-group v-model="fileAcceptValue" @change="onUpdateAccept">
        <el-radio label=".pdf">pdf</el-radio>
        <el-radio label=".zip,.rar">zip/rar</el-radio>
        <el-radio label=".mp4,.m3u8,.avi,.mov">视频</el-radio>
        <el-radio label=".jpg,.jpeg,.png,.gif">图片</el-radio>
        <el-radio label=".pdf,.zip,.rar,.mp4,.m3u8,.avi,.mov,.jpg,.jpeg,.png,.gif">不限</el-radio>
      </el-radio-group>
    </div>
    <p class="header-wrap" style="margin-bottom: 8px; margin-top: 15px">
      单个附件大小
    </p>
    <div class="inputArea">
      <el-input-number v-model="fileSizeValue" class="input" size="medium" :min="1" placeholder="请输入" @change="onUpdateSize"></el-input-number>
      MB以内
    </div>
    <p class="header-wrap" style="margin-bottom: 8px; margin-top: 15px">
      上传上限个数
    </p>
    <div class="inputArea">
      <el-input-number v-model="limitValue" class="input" size="medium" :min="1" :max="15" :disabled="disabled" placeholder="请输入" @change="onUpdate"></el-input-number>
      个
    </div>
  </div>
</template>

<script>
export default {
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
      fileAcceptValue: undefined,
      fileSizeValue: 500,
      limitValue: 1,
      checkboxDisabled: false
    }
  },
  computed: {
    disabled() {
      if (this.question.extend.limitDisabled == null) {
        return true
      } else {
        return this.question.extend.limitDisabled
      }
    }
  },
  watch: {
    'question.extend.fileAccept': {
      immediate: true,
      handler() {
        this.setFileAccept()
      }
    },
    'question.extend.fileSize': {
      immediate: true,
      handler() {
        this.setFileSize()
      }
    },
    'question.extend.limit': {
      immediate: true,
      handler() {
        this.setLimit()
      }
    }
  },
  methods: {
    setFileAccept() {
      if (this.question.extend && this.question.extend.fileType === 'multiple') {
        this.fileAcceptValue = this?.question?.extend?.fileAccept || []
      } else {
        this.fileAcceptValue = this?.question?.extend?.fileAccept || '.pdf'
      }
    },

    setFileSize() {
      this.fileSizeValue = this?.question?.extend?.fileSize
    },

    setLimit() {
      this.limitValue = this?.question?.extend?.limit
    },

    onUpdate() {
      this.$set(this.question.extend, 'limit', this.limitValue)
    },

    onUpdateSize() {
      this.$set(this.question.extend, 'fileSize', this.fileSizeValue)
    },

    changeAll(e) {
      this.checkboxDisabled = e
      if (e) {
        this.fileAcceptValue = ['.pdf,.doc,.docx,.zip,.rar,.mp4,.m3u8,.avi,.mov,.jpg,.jpeg,.png,.gif']
      } else {
        this.fileAcceptValue = []
      }
    },

    onUpdateAccept() {
      this.$set(this.question.extend, 'fileAccept', this.fileAcceptValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.header-wrap {
  display: flex;
  justify-content: space-between;
}
/deep/ .el-radio {
  margin-right: 20px;
  margin-bottom: 8px;
}
.input {
  width: 150px;
  margin-right: 10px;
}
</style>

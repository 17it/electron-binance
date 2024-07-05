<template>
  <div>
    <p class="header-wrap" style="margin-bottom: 8px">
      表单标题
      <el-switch v-model="showTitle" active-value="1" inactive-value="2" @change="onUpdate"> </el-switch>
    </p>
    <p class="header-wrap" style="margin-bottom: 8px; margin-top: 15px">
      正文字符数限制
    </p>
    <div class="inputArea">
      <el-input-number v-model="textSizeValue" class="input" size="medium" :min="1" :max="10000" placeholder="请输入" @change="onUpdateSize"></el-input-number>
      字符以内（含标点符号）
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
      showTitle: '1',
      textSizeValue: 500
    }
  },
  watch: {
    'question.extend.showTitle': {
      immediate: true,
      handler() {
        this.setShowTitle()
      }
    },
    'question.extend.textSize': {
      immediate: true,
      handler() {
        this.setTextSize()
      }
    }
  },
  methods: {
    setShowTitle() {
      this.showTitle = this?.question?.extend?.showTitle
    },

    setTextSize() {
      this.textSizeValue = this?.question?.extend?.textSize
    },

    onUpdateSize() {
      this.$set(this.question.extend, 'textSize', this.textSizeValue)
    },

    onUpdate() {
      this.$set(this.question.extend, 'showTitle', this.showTitle)
    }
  }
}
</script>

<style lang="scss" scoped>
.header-wrap {
  display: flex;
  justify-content: space-between;
}
.input {
  width: 150px;
}
</style>

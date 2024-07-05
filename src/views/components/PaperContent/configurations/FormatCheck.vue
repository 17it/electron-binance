<template>
  <div>
    <p class="header-wrap" style="margin-bottom: 8px">
      格式校验
    </p>
    <div>
      <el-radio v-model="formatType" label="1" @click.native.prevent="onChange(formatType)">11位正整数</el-radio>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formatType: ''
    }
  },
  watch: {
    'question.extend.formatType': {
      immediate: true,
      handler() {
        this.setFormatType()
      }
    }
  },
  methods: {
    setFormatType() {
      this.formatType = this?.question?.extend?.formatType
    },

    onChange(value) {
      this.formatType = value === '1' ? '' : '1'
      this.onUpdate()
    },

    onUpdate() {
      this.$set(this.question.extend, 'formatType', this.formatType)
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
  margin-right: 13px;
}
.input {
  width: 150px;
  margin-right: 10px;
}
</style>

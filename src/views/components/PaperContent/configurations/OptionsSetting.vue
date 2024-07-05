<template>
  <div>
    <p v-if="question.type === '14' || question.type === '15'" class="header-wrap" style="margin-bottom: 8px">
      格式校验
    </p>
    <div v-if="question.type === '14' || question.type === '15'" style="margin-bottom: 25px">
      <el-radio v-model="formatType" label="1" @click.native.prevent="onChange(formatType)">11位整数</el-radio>
    </div>
    <p class="header-wrap" style="margin-bottom: 8px">
      {{ question.extend.mixText }}
    </p>
    <div class="inputArea">
      <el-input-number v-model="minLimit" class="input" size="medium" :min="1" :disabled="disabled" placeholder="请输入" @change="onUpdate"></el-input-number>
      {{ question.extend.limitText }}
    </div>
    <p class="header-wrap" style="margin-bottom: 8px; margin-top: 15px">
      {{ question.extend.maxText }}
    </p>
    <div class="inputArea">
      <el-input-number v-model="maxLimit" class="input" size="medium" :min="question.extend.minLimit" :disabled="disabled" placeholder="请输入" @change="onUpdate"></el-input-number>
      {{ question.extend.limitText }}
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
      formatType: '',
      minLimit: 1,
      maxLimit: 1,
      disabled: false
    }
  },
  watch: {
    'question.extend.formatType': {
      immediate: true,
      handler() {
        this.setFormatType()
      }
    },
    'question.extend.minLimit': {
      immediate: true,
      handler() {
        this.setMinLimit()
      }
    },
    'question.extend.maxLimit': {
      immediate: true,
      handler() {
        this.setMaxLimit()
      }
    }
  },
  methods: {
    setFormatType() {
      this.formatType = this?.question?.extend?.formatType
      if (this.formatType === '1') {
        this.minLimit = 1
        this.maxLimit = 11
        this.disabled = true
      } else {
        this.disabled = false
      }
    },

    onChange(value) {
      this.formatType = value === '1' ? '' : '1'
      if (this.formatType === '1') {
        this.minLimit = 1
        this.maxLimit = 11
        this.disabled = true
      } else {
        this.disabled = false
      }
      this.onUpdate()
    },

    setMinLimit() {
      this.minLimit = this?.question?.extend?.minLimit
    },

    setMaxLimit() {
      this.maxLimit = this?.question?.extend?.maxLimit
    },

    onUpdate() {
      this.$set(this.question.extend, 'formatType', this.formatType)
      this.$set(this.question.extend, 'minLimit', this.minLimit)
      this.$set(this.question.extend, 'maxLimit', this.maxLimit)
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

<template>
  <div class="question">
    <el-rate :max="10" :value="myValue"></el-rate>
  </div>
</template>

<script>
export default {
  name: 'QuestionRate',
  props: {
    value: {
      type: [Number, String, Array],
      default: 0
    }
  },
  data() {
    return {
      myValue: undefined
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.setMyValue()
      }
    }
  },
  methods: {
    setMyValue() {
      if (Array.isArray(this.value)) {
        if (Number(this.value[0]) <= 10 && Number(this.value[0]) >= 0) {
          this.myValue = Number(this.value[0])
        } else {
          this.myValue = 0
        }
      } else {
        this.myValue = this.value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-rate {
  height: 28px;

  .el-rate__item {
    padding-right: 20px;

    .el-rate__icon {
      font-size: 28px;
    }
  }
}
</style>

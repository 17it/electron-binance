<!-- 我们把ele组件常用属性放在这里，如果会用到更多其他属性可以进行扩展 -->
<template>
  <el-input-number
    v-model="myValue"
    class="my-input-number"
    v-bind="attrs"
    :placeholder="attrs.placeholder || '请输入'"
    v-on="listeners"
    @change="onUpdate"
  />
</template>

<script>
export default {
  name: 'ImInputNumber',
  props: {
    value: {
      type: [Number, String],
      default: undefined
    },
    attrs: {
      type: Object,
      default() {
        return {}
      }
    },
    listeners: {
      type: Object,
      default() {
        return {}
      }
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
      this.myValue = Number(this.value)
    },
    onUpdate() {
      this.$emit('input', this.myValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-input-number {
  /deep/ .el-input__inner {
    text-align: left !important;
  }
}
</style>

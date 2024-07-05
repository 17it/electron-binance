<!-- 我们把ele组件常用属性放在这里，如果会用到更多其他属性可以进行扩展 -->
<template>
  <el-radio-group v-model="myValue" v-bind="attrs" v-on="listeners">
    <el-radio
      v-for="opt in attrs.options"
      :key="opt.value"
      :disabled="opt.disabled"
      :label="opt.value"
    >
      {{ opt.label }}
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'ImRadio',
  props: {
    value: {
      type: [String, Number, Boolean],
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
  computed: {
    myValue: {
      get() {
        return this.value
      },
      set(str) {
        this.$emit('input', str)
        // this.$emit('change', str)
      }
    }
  }
}
</script>

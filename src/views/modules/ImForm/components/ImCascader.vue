<template>
  <el-cascader
    v-model="myValue"
    v-bind="attrs"
    v-on="listeners"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'ImCascader',
  props: {
    value: {
      type: [String, Array, Number, Boolean],
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
      try {
        this.myValue = JSON.parse(JSON.stringify(this.value))
      } catch (error) {
        this.myValue = undefined
      }
    },
    onChange() {
      this.$emit('input', this.myValue)
    }
  }
}
</script>

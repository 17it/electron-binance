<template>
  <el-date-picker
    v-model="myValue"
    v-bind="attrs"
    unlink-panels
    v-on="listeners"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'ImDatePicker',
  props: {
    value: {
      type: [String, Object, Array, Number, Date],
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

<template>
  <div class="question">
    <el-input
      :value="myValue"
      size="medium"
      :type="extend.inputType"
      :rows="4"
      placeholder="请输入"
      @input="onUpdate"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: 'QuestionInput',
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    extend: {
      type: Object,
      default: () => {
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
      if (Array.isArray(this.value)) {
        this.myValue = this.value[0]
      } else {
        this.myValue = this.value
      }
    },

    onUpdate() {
      this.$emit('input', [this.myValue])
    }
  }
}
</script>

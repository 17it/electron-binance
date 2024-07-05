<template>
  <span ref="editableText" :contenteditable="contenteditable" @blur="onUpdate" v-html="value"></span>
</template>

<script>
export default {
  name: 'EditableText',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    contenteditable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onUpdate() {
      const text = this.$refs.editableText.innerText
      this.$emit('input', text)
    }
  }
}
</script>

<template>
  <div
    :style="attrs.style"
    style="min-height: 50px; line-height: 50px; transform: translate(0, -11px)"
  >
    <el-button
      v-for="(opt, idx) in attrs.options"
      :key="idx"
      v-bind="opt.attrs"
      v-on="opt.listeners"
    >
      {{ opt.label }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ImButton',
  props: {
    value: {
      type: String,
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
  }
}
</script>

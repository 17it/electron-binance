<template>
  <div class="splitArea" :style="{ height: `${height}px` }"></div>
</template>

<script>
export default {
  name: 'FormSplit',
  props: {
    height: {
      type: Number,
      default: 16
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

.splitArea {
  width: calc(100% + 32px);
  margin-top: 16px;
  background: $mainbgColor;
  transform: translate(-16px, 0);
}
</style>

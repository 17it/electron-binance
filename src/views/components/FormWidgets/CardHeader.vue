<template>
  <div class="cardHeader">
    <span class="text">{{ text }}</span>
    <slot name="extra"></slot>
  </div>
</template>

<script>
export default {
  name: 'Cardheader',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.cardHeader {
  display: flex;
  box-sizing: border-box;
  gap: 16px;
  align-items: center;
  width: calc(100% + 32px);
  height: 44px;
  margin-bottom: 24px;
  padding-left: 20px;
  line-height: 44px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transform: translate(-16px, 0);
  position: relative;

  &::before {
    position: absolute;
    top: 15px;
    left: 12px;
    content: '';
    display: inline-block;
    width: 3px;
    height: 14px;
    background: #3d74ff;
    border-radius: 2px;
  }

  .text {
    color: #000;
    font-weight: 500;
    font-size: 14px;
  }
}
</style>

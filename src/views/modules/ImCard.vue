<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="headerWrapper">
      <span class="headertext title">
        <slot name="title"></slot>
      </span>
      <slot name="extra"></slot>
    </div>
    <slot></slot>
  </el-card>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
.box-card {
  min-width: 850px;
  margin-bottom: 16px;

  .headerWrapper {
    display: flex;
    align-items: center;
  }

  .headertext {
    color: #000;
    font-weight: 600;
    font-size: 14px;
    position: relative;
  }

  .title {
    &::before {
      position: absolute;
      top: 3px;
      left: -8px;
      content: '';
      display: inline-block;
      width: 3px;
      height: 14px;
      background: #3d74ff;
      border-radius: 2px;
    }
  }

  /deep/.el-card__header {
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
  }
}
</style>

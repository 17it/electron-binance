<template>
  <div class="file-list">
    <div v-for="(item, index) in fileList" :key="index" class="file-item">
      <img class="icon-link" src="https://udstatic.imeik.com/pcUploads/1704857467592/%E9%99%84%E4%BB%B6%402x.png" />
      <span class="file-text">{{ item.name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FileUploadShow',
  props: {
    extend: {
      type: [String, Object],
      default: undefined
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    extend: {
      deep: true,
      immediate: true,
      handler(val) {
        this.fileList = val?.fileList || []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.file-list {
  margin-top: 18px;
  width: 100%;
  display: flex;
  flex-direction: column;
  .file-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 7px;
    box-sizing: border-box;
    .icon-link {
      width: 14px;
      height: 14px;
      margin-right: 9px;
    }
    .file-text {
      flex: 1;
      height: 21px;
      font-size: 15px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #005DBE;
      line-height: 21px;
      text-decoration: underline;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>

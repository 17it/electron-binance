<template>
  <div class="activity-text">
    <div v-if="extendInfo.showClassifyDesc === '1'" class="select-decs-wrap">
      <div>{{ extendInfo.classifyDesc }}</div>
    </div>
    <div v-if="extendInfo.showTitle === '1'" class="select-decs-wrap">
      <el-input placeholder="添加标题" :maxlength="100" show-word-limit></el-input>
    </div>
    <el-input type="textarea" placeholder="添加正文" :maxlength="extendInfo.textSize" show-word-limit></el-input>
  </div>
</template>
<script>
export default {
  name: 'ActivityText',
  props: {
    extend: {
      type: [String, Object],
      default: undefined
    },
    // 是否为详情页
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      extendInfo: {}
    }
  },
  watch: {
    extend: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.isDetail) {
          this.extendInfo = JSON.parse(val)
        } else {
          this.extendInfo = val
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-text {
  display: flex;
  flex-direction: column;
  .select-decs-wrap {
    margin: 10px 0;
  }
}
</style>

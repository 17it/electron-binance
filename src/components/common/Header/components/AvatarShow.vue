<template>
  <!--优先展示头像-->
  <el-avatar v-if="avatar" :key="avatar" :size="sizePx" :src="avatar" />
  <!--没有展示name后两位-->
  <span v-else-if="name" class="ava-text" :style="textStyle">
    {{ name.substr(-2) }}
  </span>
  <!--缺省值-->
  <img v-else class="avatar-img" :style="rectStyle" src="~@/assets/img/pages/user-avatar.png" />
</template>

<script>
export default {
  name: 'AvatarShow',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    sizePx() {
      if (typeof this.size === 'number') {
        return this.size
      }

      return { large: 120, normal: 80, small: 24 }[this.size] || 80
    },
    rectStyle() {
      const px = this.sizePx + 'px'
      return {
        width: px,
        height: px
      }
    },
    textStyle() {
      const fs = this.sizePx / 80 * 26

      // 如果字体小于12，采用缩放实现
      if (fs < 12) {
        const zoom = this.sizePx / 80
        return {
          width: `${this.sizePx / zoom}px`,
          height: `${this.sizePx / zoom}px`,
          zoom: zoom
        }
      }

      return {
        ...this.rectStyle,
        'line-height': this.sizePx + 'px',
        'font-size': this.sizePx / 80 * 26 + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ava-text {
  width: 80px;
  height: 80px;
  background: rgba(50,133,246,0.2);
  border: 1px solid rgba(50,133,246,0.5);
  font-size: 26px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #3285F6;
  line-height: 80px;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
}

.avatar-img {
  border-radius: 50%;
}
</style>

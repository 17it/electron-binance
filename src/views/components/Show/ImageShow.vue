<template>
  <div class="imageHolder" :style="{ width: `${width}px`, height: `${height}px` }">
    <el-image class="imageClass" :style="{ width: `${width}px`, height: `${height}px` }" :src="src" fit="cover">
      <img slot="error" class="image-holder" src="~@/assets/img/framework/img-holder.png" />
    </el-image>
    <div v-if="!customClick && src" class="operate" :style="{ lineHeight: `${height}px`, width: `${width}px` }" @click="showImage">
      <i class="el-icon-view"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageShow',
  props: {
    src: {
      type: String,
      default: ''
    },
    customClick: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 124
    },
    height: {
      type: Number,
      default: 124
    }
  },
  methods: {
    showImage() {
      if (this.customClick) {
        return
      }
      this.$viewerApi({
        options: {
          navbar: false,
          zIndex: 9999
        },
        images: [this.src]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.imageHolder {
  position: relative;
  display: flex;
  cursor: pointer;

  .imageClass {
    cursor: pointer;

    .image-holder {
      width: 100%;
      height: 100%;
    }
  }

  .operate {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    opacity: 0;
    transition: all 0.2s;

    i {
      color: white;
      font-size: 24px;
      transform: translate(0, 4px);
    }
  }

  &:hover {
    .operate {
      display: block;
      background: rgba(0, 0, 0, 0.5);
      opacity: 1;
    }
  }
}
</style>

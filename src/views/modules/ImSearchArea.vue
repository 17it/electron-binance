<template>
  <div class="common-form-view mb-4 rounded" :class="currentClass">
    <span class="form-switch" @click="formSwitch">
      {{ isShow ? '全部收起' : '全部展开' }}
      <i class="el-icon-arrow-up" :class="currentClass" />
    </span>
    <!-- <h3 class="common-form-title"><i class="el-icon-s-order" />{{ title || $route.meta.title }}</h3> -->
    <transition name="fade">
      <keep-alive>
        <slot v-if="isShow"></slot>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ImSearhArea',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: true
    }
  },
  computed: {
    currentClass() {
      return this.isShow ? 'show' : 'hide'
    }
  },
  methods: {
    formSwitch() {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

.fade-enter-active {
  transition: opacity 0.3s;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.common-form-view {
  position: relative;
  padding: 32px 20px 16px 20px;
  overflow: hidden;
  background: #fff;
  transition: max-height 0.3s;

  &.show {
    max-height: 1000px;
  }

  &.hide {
    max-height: 0;
  }

  // .common-form-title {
  //   display: flex;
  //   align-items: center;
  //   padding-bottom: 16px;
  //   color: #000;
  //   font-weight: 600;
  //   font-size: 16px;

  //   i.el-icon-s-order {
  //     margin-right: 8px;
  //     @include font_color('main-color');
  //   }
  // }

  .form-switch {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;
    width: 106px;
    height: 22px;
    color: #666;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    background: $mainbgColor;
    transform: translateX(-50%);
    cursor: pointer;
    clip-path: polygon(10px 0%, 96px 0, 100% 100%, 0% 100%);

    i {
      transition: transform 0.3s;

      &.show {
        transform: rotate(0deg);
      }

      &.hide {
        transform: rotate(180deg);
      }
    }

    &:hover {
      color: $mainColorBlue;
    }
  }
}
</style>

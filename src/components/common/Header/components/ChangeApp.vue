<template>
  <div class="changeAppContainer">
    <div v-clickoutside="hideDropDownContainer" class="dropdownTragger" @click="showDropDownContainer">
      <svg-icon class="icon" icon-class="control"></svg-icon>
      <span class="label">{{ currentPlatform.label }}</span>
      <svg-icon class="dropdownIcon" icon-class="dropdown"></svg-icon>
    </div>
    <ul v-show="shouldShow" class="dropdownContainer">
      <li v-for="item in appOptions" :key="item.value" class="dropdownItem" :class="{active: item.value===currentApp}" @click="onItemClicked(item)">
        <span class="label">{{ item.label }}</span>
        <svg-icon class="checkIcon" icon-class="checked"></svg-icon>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import clickoutside from '@/utils/clickoutside'
import { setStorage } from '@/utils/storage'

export default {
  directives: {
    clickoutside
  },
  data() {
    return {
      shouldShow: false
    }
  },
  computed: {
    ...mapGetters(['currentApp', 'appOptions']),
    currentPlatform() {
      return this.appOptions.find(item => item.value === this.currentApp)
    }
  },
  watch: {
    currentApp: {
      immediate: true,
      handler() {
        // 本地种一个currentApp 子应用里初始化的时候直接取这个值
        // 同时触发全局事件, 方便子应用监听并处理
        setStorage('currentBaseApp', this.currentApp)
        this.$store.commit('app/SET_CURRENTAPP', this.currentApp)
      }
    }
  },
  methods: {
    showDropDownContainer() {
      this.shouldShow = !this.shouldShow
    },
    hideDropDownContainer() {
      this.shouldShow = false
    },
    onItemClicked(item) {
      this.hideDropDownContainer()
      this.$store.commit('app/SET_CURRENTAPP', item.value)
      this.$nextTick(() => {
        location.reload()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/mixins.scss';
.changeAppContainer {
  display: inline-block;
  line-height: $navHeight;

  .dropdownTragger {
    display: flex;
    gap: 6px;
    align-items: center;
    cursor: pointer;

    .icon {
      font-size: 16px;
    }

    .dropdownIcon {
      font-size: 14px;
    }

    .label {
      font-size: 12px;
      color: #48576A;
    }
  }

  .dropdownContainer {
    width: 200px;
    padding: 16px;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.15);

    .dropdownItem {
      height: 36px;
      line-height: 36px;
      display: flex;
      padding: 0 12px;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;

      .label {
        font-size: 14px;
        color: #111111;
      }

      .checkIcon {
        font-size: 16px;
        display: none !important;
      }

      &.active {
        background: #EDF4FA;
        border-radius: 4px;
        .label {
          color: #005DBE;
        }
        .checkIcon {
          display: block !important;
        }
      }

      &:hover {
        background: #EDF4FA;
        border-radius: 4px;
      }
    }
  }
}
</style>

<template>
  <div class="customTabs flex justify-between" :class="'size-' + size">
    <ul class="menus flex-1">
      <li v-for="item in filteredTabList" :key="item.value" :class="{ active: activeName === item.value, disabled: item.disabled }" class="menuItem" @click="activeItem(item)">
        <div class="custom-tab-label">{{ item.label }}</div>
        <div v-if="item.count && Number(item.count) !== 0" class="custom-tab-count">{{ getCount(item.count) }}</div>
      </li>
    </ul>
    <slot name="extra"></slot>
  </div>
</template>

<script>
import utils from '@/utils/utils'
export default {
  name: 'CustomTabs',
  props: {
    activeName: {
      type: String,
      default: ''
    },
    tabList: {
      type: Array,
      default() {
        return []
      }
    },
    // 尺寸，为large时字体18px，选中后bold
    size: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {}
  },
  computed: {
    filteredTabList() {
      const result = this.tabList.filter((item) => {
        // 如果有权限控制，需要判断
        const access = !item.permission || (item.permission && item.permission.some(i => utils.hasPermission(i)))
        return !item.hidden && access
      })
      const names = result.map((item) => item.value)
      if (names.length > 0 && !names.includes(this.activeName)) {
        this.activeItem(result[0])
      }
      return result
    }
  },
  methods: {
    getCount(val) {
      if (val && Number(val) && Number(val) > 99) {
        return '99+'
      } else {
        return val
      }
    },
    activeItem(item) {
      if (item.disabled) {
        return
      }
      this.$emit('update:activeName', item.value)
      this.$emit('change', item.value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.customTabs {
  height: 60px;
  // padding: 0 10px;
  background: white;

  .menus {
    display: flex;
    line-height: 60px;
    .custom-tab-count {
      display: inline-block;
      height: 14px;
      line-height: 14px;
      background: #E1251B;
      border-radius: 7px;
      color: rgba(255, 255, 255, 1);
      font-size: 12px;
      padding: 0 4px;
      flex-shrink: 1;
      margin-left: 4px;
      margin-top: -3px;
    }
    .menuItem {
      min-width: 56px;
      min-width: min-content;
      padding: 0 20px;
      font-size: 16px;
      white-space: nowrap;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      .custom-tab-label {
        &::after {
          position: relative;
          top: -2px;
          z-index: 10;
          display: block;
          width: 0;
          height: 3px;
          margin: 0 auto;
          background: $secondColor;
          transition: all 0.2s;
          content: '';
        }
      }

      &.active {
        color: $secondColor;
        font-weight: 500;
        .custom-tab-label {
          &::after {
            width: 16px;
          }
        }
      }

      &.disabled {
        color: rgba(0, 0, 0, 0.45);
        cursor: not-allowed;
      }
    }
  }

  &.size-large {
    .menus {
      .menuItem {
        font-size: 18px;

        &.active {
          font-weight: 600;
        }
      }
    }
  }
}
</style>

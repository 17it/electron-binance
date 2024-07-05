<template>
  <el-card v-show="contextMenuInfo.bShow" class="contextmenu" :style="{ left: left + 'px', top: top + 'px' }" :body-style="{ padding: 0 }">
    <ul>
      <li contextmenu-item="true" @click="menuHandler($event, 'refresh')">重新加载</li>
      <li contextmenu-item="true" @click="menuHandler($event, 'closeAll')">关闭所有</li>
      <li v-if="bShowCloseLeft" contextmenu-item="true" @click="menuHandler($event, 'closeLeft')">关闭左边</li>
      <li v-if="bShowCloseRight" contextmenu-item="true" @click="menuHandler($event, 'closeRight')">关闭右边</li>
      <li contextmenu-item="true" @click="menuHandler($event, 'closeOther')">关闭其他</li>
    </ul>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ContextMenu',
  props: {
    contextMenuInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['editableTabs', 'currentTab']),
    left() {
      if (!this.contextMenuInfo.event) return -100
      const { pageX, offsetX, target } = this.contextMenuInfo.event
      return pageX - offsetX + target.clientWidth - 30
    },
    top() {
      if (!this.contextMenuInfo.event) return -100
      const { pageY, offsetY, target } = this.contextMenuInfo.event
      return pageY - offsetY + target.clientHeight - 8
    },
    index() {
      // 通过dom获取点击的tab的序号
      if (!this.contextMenuInfo.event) {
        return -1
      }
      let ele = this.contextMenuInfo.event.target
      // IE is simplest and fastest
      if (ele.sourceIndex) {
        return ele.sourceIndex - ele.parentNode.sourceIndex - 1
      }
      // other browsers
      let i = 0
      ele = ele.previousElementSibling
      while (ele) {
        ele = ele.previousElementSibling
        i++
      }
      return i - 1
    },
    bShowCloseLeft() {
      return this.index > 1
    },
    bShowCloseRight() {
      return this.index < this.editableTabs.length - 1
    }
  },
  methods: {
    menuHandler(e, type) {
      e.stopPropagation()
      // 执行具体的操作
      this[type] && this[type](e)
      // 关闭菜单
      this.$set(this.contextMenuInfo, 'bShow', false)
      // 更新tab对应的内容
      const current = this.currentTab
      this.$router
        .replace({
          name: current.name,
          params: current.params,
          query: current.query
        })
        .catch((err) => err)
    },
    refresh() {
      // 通过控制router-view和keep-alive控制刷新
      const name = this?.contextMenuInfo?.event?.target?.id?.replace('tab-', '')
      this.$store.commit('app/CANCEL_KEEP_ALIVE', name)
      this.$store.commit('app/TOGGLE_ROUTER_ALIVE')
      this.$nextTick(() => {
        this.$store.commit('app/TOGGLE_ROUTER_ALIVE')
      })
    },
    closeAll() {
      this.$store.dispatch('app/removeAllTab')
    },
    closeLeft() {
      this.$store.dispatch('app/removeAsideTab', { index: this.index, dir: 'left' })
    },
    closeRight() {
      this.$store.dispatch('app/removeAsideTab', { index: this.index, dir: 'right' })
    },
    closeOther() {
      this.$store.dispatch('app/removeOtherTab', this.index)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.contextmenu {
  position: absolute;
  z-index: 3000;
  width: auto;
  list-style-type: none;

  li {
    padding: 4px 10px;
    color: #2c3e50;
    font-size: 12px;

    &:hover {
      background: #ecf1fe;
      cursor: pointer;
    }
  }
}
</style>

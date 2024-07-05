<template>
  <div :class="[classObj, themeName]" @mousedown="closeContextMenu">
    <!-- <template v-if="!isSingleRun">
      <keep-alive>
        <router-view />
      </keep-alive>
    </template> -->
    <!-- <template> -->
    <navbar />
    <sidebar class="sidebar-container" />
    <div v-if="showTab" class="main-container">
      <div class="tabs-wrt">
        <div class="content-tabs">
          <el-tabs v-if="showCommonView" ref="topTabs" v-model="editableTabsValue" @tab-click="tabClick" @tab-remove="removeTab">
            <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name" :closable="item.name !== 'Platform'" />
          </el-tabs>
        </div>
        <!-- <RouterBreadcrumb style="margin-bottom: 10px;"></RouterBreadcrumb> -->
        <div class="content-wrapper">
          <div slot="content">
            <app-main />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="main-container">
      <app-main />
    </div>
    <div class="footer-container">imeik {{ year }}</div>
    <!-- tab右键菜单 -->
    <ContextMenu :context-menu-info="contextMenuInfo" />
    <!-- </template> -->
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, ContextMenu } from '@/components/common'
import { mapGetters } from 'vuex'
// import RouterBreadcrumb from '@/components/RouterBreadcrumb/index.vue'
// let lastMatched = [] // 上次路由匹配的路径
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    ContextMenu
    // RouterBreadcrumb
  },
  provide() {
    return {
      // 模板工程特性配置开关，可以通过此配置开关相应的特性
      features: {
        // 是否开启常用菜单
        favouritesNav: true
      },
      removeTab: this.removeTab
    }
  },
  data() {
    return {
      contextMenuInfo: {
        bShow: false, // 是否展示右键菜单
        event: null
      },
      year: new Date().getFullYear()
    }
  },
  computed: {
    ...mapGetters(['isSingleRun', 'sidebar', 'showCommonView', 'showTab', 'themeColor', 'editableTabs']),
    themeName() {
      return `theme-${this.themeColor}`
    },
    classObj() {
      return {
        hideSidebarAll: !this.sidebar.showSidebar,
        hideSidebar: !this.sidebar.opened,
        hideNavbar: !this.showCommonView,
        hideTabs: !this.showTab
      }
    },
    editableTabsValue: {
      get() {
        return this.$store.state.app.editableTabsValue
      },
      set(name) {}
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue.meta.topIndex !== undefined) {
          // 判断是否切换左侧导航栏
          this.$store.commit('app/SET_CURRENT_ACTIVE_MENU_INDEX', newValue.meta.topIndex)
          // 切换顶部菜单选中态
          this.$store.commit('app/SET_TOP_MENU_ACTIVE_INDEX', newValue.meta.topIndex)
        }

        // 支持首次加载首页
        // const matchedArr = newValue.matched.map(item => item.path).filter(item => item !== '/' && item !== '')
        if (this.editableTabsValue !== newValue.path && !newValue.meta.noTab) {
          // 支持首次加载首页  // 添加页面
          this.$store.dispatch('app/addTab', {
            title: newValue.meta.title,
            name: newValue.name,
            content: newValue.path,
            params: newValue.params,
            query: newValue.query
          })
        } else {
          // 如果notab, 则顶部不选中
          this.$store.commit('app/SET_EDITABLETABSVALUE', '')
        }
        // 更新上一次路径
        // lastMatched = matchedArr
      }
    }
  },
  mounted() {
    if (this.$refs && this.$refs.topTabs) {
      // 为tab项添加右键菜单功能
      this.$refs.topTabs.$el.addEventListener(
        'contextmenu',
        (e) => {
          if (/^tab-[\w|/|-]+$/.test(e.target.id)) {
            this.contextmenuHandler(e)
          }
        },
        false
      )
    }
  },
  methods: {
    tabClick(e) {
      // 读取store中路由参数
      const item = this.editableTabs[e.index]
      this.$router.push({ name: item.name, params: item.params, query: item.query }).catch((err) => err)
    },

    removeTab(e) {
      this.$store.dispatch('app/removeTab', e)
      const current = this.$store.state.app.currentTab
      this.$router.replace({ name: current.name, params: current.params, query: current.query }).catch((err) => err)
    },

    contextmenuHandler(e) {
      e.preventDefault()
      this.contextMenuInfo.bShow = true
      this.contextMenuInfo.event = e
    },
    // 鼠标按下时，关闭tab右键菜单
    closeContextMenu(e) {
      if (!e.target.getAttribute('contextmenu-item') && this.contextMenuInfo.bShow) {
        this.contextMenuInfo.bShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixins.scss';

.app-wrapper {
  &::after {
    display: table;
    clear: both;
    content: '';
  }

  position: relative;
  width: 100%;
  height: 100%;
}

.tabs-wrt {
  .content-wrapper {
    background: #fff;
  }
}

.content-tabs {
  user-select: none;

  /deep/ .el-tabs {
    &__header {
      margin: 0 0 0 0;
    }

    &__nav-wrap {
      margin-bottom: 0;
      padding: 6px 16px 0;
      background: #FBFBFB;
      overflow: unset;
      height: 34px;
      box-shadow: 0 1px 0 0 #e9e9e9;
      // border-bottom: 1px solid #E9E9E9;

      &.is-scrollable {
        padding: 6px 40px;
      }

      &::after {
        display: none;
      }
    }

    &__item {
      padding: 0 8px 0 12px !important;
      color: #666;
      height: 34px;
      line-height: 34px;

      &.is-active {
        background: #F0F2F5;
        @include font_color('menu-active-color');
        border-radius: 6px 6px 0 0;
        position: relative;
        border: 1px solid #E9E9E9;
        border-bottom: none;
        margin: 0 5px;

        &::after, &::before {
          position: absolute;
          content: '';
          width: 8px !important;
          height: 16px !important;
          display: block;
          text-align: center;
          // background-image: radial-gradient(6px at 6px 0px, #FBFBFB 6px, #F0F2F5 6px);
          bottom: 0;
          border: none;
          top: 17px !important;
        }

        &::before {
          left: -8px !important;
          // transform: scaleX(-1);
          background-image: url(~@/assets/img/pages/left_circle.png);
          background-size: 100% 100%;
        }

        &::after {
          right: -8px;
          background-image: url(~@/assets/img/pages/right_circle.png);
          background-size: 100% 100%;
        }
      }

      .el-icon-close {
        visibility: hidden;
      }

      &:hover,
      &.is-active {
        .el-icon-close {
          visibility: visible;
        }
      }

      // 隐藏第二个，因为第一个元素是横线
      &.is-top:not(:nth-child(2))::before {
        position: absolute;
        top: 9px;
        left: 1px;
        height: 16px;
        border-left: 1px solid rgba(217, 217, 217, 1);
        content: '';
      }

      // 隐藏选择的页签及其后面一个页签的伪元素
      &.is-top.is-active::before, &.is-top.is-active + .is-top::before {
         border-left: none;
      }
    }

    &__nav-prev {
      left: 20px;
      top: 5px;
      line-height: 35px;
    }

    &__nav-next {
      right: 20px;
      top: 5px;
      line-height: 35px;
    }

    &__active-bar {
      display: none;
    }
  }
}
</style>

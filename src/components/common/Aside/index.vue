<template>
  <div>
    <div v-if="!isCollapse" class="side-menu-search">
      <el-input v-model="searchKey" type="text" clearable placeholder="请输入菜单名称">
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
    </div>
    <el-scrollbar :style="`height: ${sidebar.opened?'calc(100% - 154px)':'calc(100% - 90px)'}`" class="el-menu-vertical">
      <div v-if="favouritesNav && !isCollapse" class="favourite-wrap">
        <favourites v-show="!searchKey" />
      </div>
      <el-menu ref="sideMenu" :unique-opened="false" :collapse="isCollapse" mode="vertical" router :default-active.sync="defaultActive" @select="onMenuSelect">
        <el-menu-item-group title="导航菜单">
          <sidebar-item v-for="route in menus" :key="route.path" :item="route" :base-path="route.path" :search-key="searchKey" />
        </el-menu-item-group>
      </el-menu>
    </el-scrollbar>
    <div class="sidebar-icon-area">
      <div class="icon-container" @click="toggleSideBar">
        <svg-icon :icon-class="sidebar.opened ? 'side-unfold' : 'side-fold'"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem.vue'
import Favourites from './Favourites.vue'
import { mapGetters } from 'vuex'

export default {
  components: { SidebarItem, Favourites },
  provide() {
    return {
      showToolTip: this.sidebar.showToolTip
    }
  },
  inject: ['features'],
  data() {
    return {
      searchKey: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'topMenuActiveIndex', 'routers']),
    favouritesNav() {
      return !!this.features.favouritesNav
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    defaultActive() {
      return this.$route.meta.highlightPath || this.$route.path
    },
    menus() {
      return this.routers
    }
  },
  methods: {
    /**
     * 防止点击菜单和当前激活菜单不一致的情况
     */
    onMenuSelect(indexPath) {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.activeIndex = this.defaultActive
        }
      })
    },
    toggleSideBar() {
      this.$store.commit('app/TOGGLE_SIDEBAR')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';
@import '~@/assets/styles/mixins.scss';
.el-menu-vertical {
  height: calc(100% - 109px);
}

.favourite-wrap {
  border-bottom: 1px solid rgba(233, 233, 233, 0.5);
  margin: 0 16px;

  ::v-deep .gyl-aside-item {
    margin: 8px 0;
  }
}

.side-menu-search {
  position: relative;
  padding: 16px 14px;
  line-height: 1;

  ::v-deep .el-input__inner {
    width: 100%;
    height: 32px;
    padding: 0 12px 0 34px;
    color: #333;
    background: rgba(243, 243, 243, 1) !important;
    border: 0;
    // border-radius: 20px;
  }
}

.sidebar-icon-area {
  width: 100%;
  height: 40px;
  border-top: 1px rgba(0, 21, 41, 0.10) solid;

  .icon-container {
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    padding: 10px;
    width: 100%;
    @include font-color('menu-sidebar-icon');

    &:hover {
      svg {
        color: $mainColorBlue;
      }
    }
  }
}
</style>

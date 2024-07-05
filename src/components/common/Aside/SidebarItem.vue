<template>
  <div v-if="!item.hidden" class="gyl-aside-item" @click.stop>
    <!--如果只有一个子菜单，就展示该菜单项即可-->
    <template v-if="hasOneShowingChild(item.children, item)">
      <div v-if="onlyOneChild.meta">
        <el-menu-item
          v-if="onlyOneChild.meta.title.includes(searchKey)"
          :class="{
            'submenu-title-noDropdown': !isNest,
            searchResult: searchKey
          }"
          :index="resolvePath(onlyOneChild.path)"
        >
          <item :item="onlyOneChild" :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" :search-key="searchKey" />
        </el-menu-item>
      </div>
    </template>
    <!--如果有多个子菜单，先展示父菜单-->
    <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <!--展示父菜单，这里的slot=title是lui里定义的具名slot-->
      <template slot="title">
        <item v-if="item.meta" :item="item" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!--如果有子菜单，则递归展示sidebar-item-->
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" :search-key="searchKey" class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item.vue'
// import AppLink from './Link.vue'

export default {
  name: 'SidebarItem',
  components: { Item },
  inject: ['showToolTip'],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    searchKey: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      toolTipDisabled: false
    }
  },
  computed: {
    isShowToolTip() {
      return this.showToolTip ? this.toolTipDisabled : true
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        }
        // Temp set(will be used if only has one showing child)
        this.onlyOneChild = item
        return true
      })

      // When there is only one child router, the child router is displayed by default
      // 如果想只有一个菜单的时候就展示这一个的话，返回true
      if (showingChildren.length === 1) {
        if (showingChildren[0].meta.onlyShow) {
          return true
        } else {
          return false
        }
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';
@import '~@/assets/styles/mixins.scss';

::v-deep .el-menu-item {
  height: 36px;
  line-height: 36px;

  &:hover {
    background-color: $headerColor !important;
    border-radius: 4px;

    .action-icon {
      opacity: 1;
    }
  }
}

::v-deep .side-item-container {
  height: 36px;
  line-height: 36px;
}

.searchResult {
  @include font_color("main-color");
}

.sidebar-container .el-menu-item.is-active {
  background-color: $headerColor !important;
  border-radius: 4px;
}

/deep/.nest-menu span.menu-text {
  padding-left: 6px;
}
</style>

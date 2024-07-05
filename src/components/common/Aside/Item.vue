<template>
  <div class="side-item-container">
    <svg-icon v-if="icon" class="sidebar-icon" :icon-class="icon"></svg-icon>
    <template v-else-if="icons.length && icons.length > 1">
      <img :src="require('../../../assets/img/sidebar/'+icons[0])" class="sidebar-icon-image" />
      <img :src="require('../../../assets/img/sidebar/'+icons[1])" class="sidebar-icon-image-active" />
    </template>
    <span v-if="title" class="menu-text">{{ title }}</span>
    <el-tooltip v-if="features.favouritesNav && isLeaf" :open-delay="300" class="item-tooltip menu-favourite" effect="dark" :content="isFavourite ? '取消收藏' : '收藏'" placement="top">
      <i
        :class="{
          'is-favourite': isFavourite
        }"
        class="action-icon el-icon-star-on"
        @click.stop="toggleFavourite"
      />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  inject: ['features'],
  props: {
    item: {
      type: Object,
      default: () => ({ chilren: [] })
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    searchKey: {
      type: String,
      default: ''
    }
  },

  computed: {
    isLeaf() {
      return !this.item.children || this.item.children.length === 0
    },
    isCollapse() {
      return !this.$store.state.app.sidebar.opened
    },
    favourites() {
      return this.$store.state.app.favouriteMenu
    },
    isFavourite() {
      return this.favourites.find((fav) => fav.path === this.item.path)
    },
    // 有可能meta里配置的是icons
    icons() {
      return this.item.meta && this.item.meta.icons || []
    }
  },

  methods: {
    toggleFavourite() {
      this.$store.commit('app/TOGGLE_FAVOURITE_MENU', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
.side-item-container {
  display: flex;
  align-items: center;
  height: 44px;
  line-height: 44px;

  .sidebar-icon {
    margin-right: 8px;
    font-size: 18px;
  }
}

.hideSidebar {
  .menu-text,
  .menu-favourite {
    display: none;
  }
}

.action-icon {
  position: absolute;
  top: 8px;
  right: 16px;
  color: rgba(210, 210, 210, 1) !important;
  font-size: 18px;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;

  &.is-favourite {
    color: rgba(254, 203, 82, 1) !important;
    opacity: 1;

    &:hover {
      color: rgba(254, 164, 82, 1) !important;
    }
  }
}
</style>

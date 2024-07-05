<template>
  <div class="navbar">
    <logo class="hidden-xs-only" />
    <!-- <span class="navbar-title">后台管理系统</span> -->
    <ChangeApp class="navbar-title"></ChangeApp>
    <div class="right-menu">
      <a href="javascript:;" class="navbar-ico">
        <svg-icon v-if="isFullScreen" title="进入全屏" icon-class="icon-fullscreenExit" @click="toggleFullScreen"></svg-icon>
        <svg-icon v-else title="退出全屏" icon-class="icon-fullscreen" @click="toggleFullScreen"></svg-icon>
      </a>
      <Avatar></Avatar>
    </div>
  </div>
</template>

<script>
import WaterMark from 'watermark-dom'
import Logo from './Logo.vue'
import { mapGetters } from 'vuex'
import utils from '@/utils/utils'
import clickoutside from '@/utils/clickoutside'
import Avatar from './components/Avatar'
import ChangeApp from './components/ChangeApp'
// import TopMenu from './TopMenu.vue'
// import Search from './Search.vue'
// 主题存储的key
const THEME_KEY = 'admin-theme'
export default {
  components: {
    Logo,
    Avatar,
    ChangeApp
    // TopMenu
    // Search
  },
  directives: {
    clickoutside
  },
  data() {
    return {
      showChangeTheme: false,
      isFullScreen: false,
      showCenter: false,
      allSize: ''
    }
  },

  computed: {
    ...mapGetters(['name', 'ename', 'theme'])
  },
  watch: {
    ename(newVal, oldVal) {
      if (newVal === oldVal) return
      // 添加水印
      this.addWaterMark()
    },
    name(newVal, oldVal) {
      if (newVal === oldVal) return
      // 添加水印
      this.addWaterMark()
    }
  },
  created() {
    this.initTheme()
    // 添加水印
    if (this.ename || this.name) {
      this.addWaterMark()
    }
  },
  methods: {
    closed() {
      this.showCenter = false
    },
    addWaterMark() {
      const mobile = (this.ename || '').substr(this.ename.length - 4)
      WaterMark.load({
        watermark_fontsize: '13px',
        watermark_alpha: '0.04',
        watermark_angle: 30,
        watermark_txt: `${this.name} ${mobile}`
      })
    },
    changeTheme(e) {
      const themeColor = e.target.dataset.theme

      // 兼容点击边缘主题问题
      if (!themeColor) {
        return
      }
      localStorage.setItem(THEME_KEY, themeColor)
      this.changeThemeCore(themeColor)
    },
    // 初始化主题：从存储中
    initTheme() {
      const themeColor = localStorage.getItem(THEME_KEY)
      if (themeColor) {
        this.changeThemeCore(themeColor)
      } else {
        this.changeThemeCore(this.theme)
      }
    },
    changeThemeCore(themeColor = 'blue') {
      if (themeColor === 'red') {
        document.body.classList.add('jdwl-admin-red')
      } else {
        document.body.classList.remove('jdwl-admin-red')
      }
      this.$store.commit('app/SET_THRME_COLOR', themeColor)
    },
    toggleFullScreen() {
      if (utils.getFullscreenElement()) {
        utils.exitFullscreen()
        this.isFullScreen = false
      } else {
        utils.launchIntoFullscreen()
        this.isFullScreen = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixins.scss';

.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  height: $navHeight;
  transition: width 0.28s;
  @include background_color('main-color');
  border-bottom: 2px solid #E8EEF4;

  .navbar-title {
    font-size: 17px;
    font-family: HarmonyOS_Sans_SC_Medium;
    color: #005DBE;
    // font-weight: bold;
    line-height: $navHeight;
    margin-left: -22px;
  }
}

.right-menu {
  display: flex;
  align-items: center;
  float: right;
  height: 100%;
  line-height: $navHeight;

  .hoverBg:hover {
      /* 设置文字属性 */
      background: #064FB0;
  }

  .navbar-ico {
    position: relative;
    display: inline-block;
    height: 100%;
    padding: 0 12px;
    font-size: 20px;

    .iconBox{
      position: absolute;
      top: 8px;
      left: 23px;
      padding: 3px 5px;
      color: #FFF;
      font-weight: 400;
      font-size: 10px;
      line-height: 9px;
      text-align: center;
      background: #E1251B;
      border-radius: 7px;
      }

    i,svg {
      @include font_color('header-text-color');
    }
  }
}

.themes {
  display: flex;
  justify-content: space-around;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 14px;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    img {
      width: 160px;
      margin-bottom: 10px;
    }

    .font_family {
      color: rgba(237, 237, 237, 1);
      font-size: 22px;
    }

    &.is-active {
      .font_family {
        color: rgba(54, 190, 147, 1);
      }
    }

    &:hover {
      &.blue {
        background: rgba(60, 110, 240, 0.04);
        border-color: rgba(219, 226, 246, 1);
      }

      &.red {
        background: rgba(225, 37, 27, 0.04);
        border-color: rgba(249, 219, 217, 1);
      }
    }
  }
}
</style>

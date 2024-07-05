<template>
  <div class="navbar-logo-container">
    <router-link class="navbar-logo-link" to="/">
      <!-- 图片logo  样式一-->
      <img src="@/assets/img/pages/logo2023.svg" class="sidebar-logo" />
      <!--<span v-show="title" class="dep" />-->

      <!-- 文字 logo  样式二 -->
      <!-- <h1 class="sidebar-title">{{ title }}</h1> -->
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavbarLogo',
  data() {
    return {
      title: 'ImeikAdmin'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixins.scss';

.navbar-logo-container {
  float: left;
  width: 200px;
  height: 100%;
  line-height: $navHeight;
  // text-align: center;
  box-sizing: border-box;
  padding-left: 16px;

  &::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 18px;
    background: rgba(0,93,190,0.2);
    top: 20px;
    left: 162px;
  }

  .navbar-logo-link {
    cursor: pointer;
    display: block;
    height: 100%;
  }

  .sidebar-logo {
    display: inline;
    height: auto;
    max-height: $navHeight;
    vertical-align: middle;
    border-style: solid;
    margin-bottom: 5px;
  }

  .dep {
    display: inline-block;
    width: 1px;
    height: 20px;
    margin: 0 10px;
    line-height: 20px;
    vertical-align: middle;
    opacity: 0.6;
    @include themify() {
      background: themed('primary-color');
    }
  }

  .sidebar-title {
    display: inline-block;
    color: #fff;
    font-weight: 600;
    font-size: 22px;
    vertical-align: middle;
  }
}
</style>

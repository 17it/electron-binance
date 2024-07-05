<template>
  <div class="gyl-full-screen container-404">
    <div class="pic-404">
      <div class="pic-404-bg" />
      <el-button v-permission="['menu_platform']" type="primary" class="go-home" @click="routerback"> 返回首页 </el-button>
    </div>
  </div>
</template>

<script>
const rootPath = process.env.VUE_APP_ROOT_PATH
export default {
  name: 'Page404',
  methods: {
    routerback() {
      this.$router.push(rootPath)
    }
  }
}
</script>

<style lang="scss" scoped>
.container-404 {
  padding: 60px 0 0;

  .pic-404 {
    text-align: center;
  }

  .pic-404-bg {
    width: 660px;
    height: 397px;
    margin: 0 auto;
    background: url(~@/assets/img/framework/404.png) no-repeat;
    background-size: 100% 100%;
  }

  .go-home {
    margin-top: 30px;
    text-align: center;
  }
}
</style>

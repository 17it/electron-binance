<template>
  <div class="gyl-full-screen container-404">
    <div class="pic-403">
      <div class="pic-403-bg" />
      <div style="font-size: 40px;">403</div>
      <div>对不起，暂无访问权限</div>
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

  .pic-403 {
    text-align: center;
  }

  .pic-403-bg {
    width: 360px;
    height: 309px;
    margin: 0 auto;
    background: url(~@/assets/img/framework/403.png) no-repeat;
    background-size: 100% 100%;
  }

  .go-home {
    margin-top: 30px;
    text-align: center;
  }
}
</style>

<template>
  <ImWrapper>
    <div class="homeMine">
      <img src="@/assets/img/home.svg" />
      <div class="homeMine_text">欢迎使用中台BASE管理系统</div>
    </div>
  </ImWrapper>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.homeMine {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  height: calc(100vh - 154px);
  &_text {
    margin-top: 36px;
    font-size: 22px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
</style>

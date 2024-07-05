<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters(['isSingleRun'])
  },
  mounted() {
    if (!this.isSingleRun) {
      document.body.style.overflow = 'auto'
    }
  }
}
</script>

<style lang="scss">
@import './assets/styles/index.scss';
</style>

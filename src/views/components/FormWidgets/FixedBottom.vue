<template>
  <div class="fixedBottom fixed bottom-0 text-center right-0 p-2 bg-white shadow-dark-50 shadow-2xl z-10" :class="{sidebarOpened}">
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FixedBottom',
  computed: {
    ...mapGetters(['sidebar']),
    sidebarOpened() {
      return !!this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.fixedBottom {
  left: 54px;

  &.sidebarOpened {
    left: 200px;
  }
}
</style>

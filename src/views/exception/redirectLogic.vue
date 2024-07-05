<template>
  <div></div>
</template>

<script>
import { TempAsyncRouterMap } from '@/router/index.js'
const rootPath = process.env.VUE_APP_ROOT_PATH

export default {
  name: 'RedirectLogic',
  data() {
    return {
      routerPathArray: []
    }
  },
  beforeMount() {
    this.getRouterPath(TempAsyncRouterMap)
    if (this.routerPathArray.includes(this.$route.path)) {
      this.$router.replace(`${rootPath}/403`)
    } else {
      this.$router.replace(`${rootPath}/404`)
    }
  },
  methods: {
    getRouterPath(routers) {
      for (let i = 0; i < routers.length; i++) {
        const item = routers[i]
        if (item.path) {
          this.routerPathArray.push(item.path)
        }
        if (item.children) {
          this.getRouterPath(item.children)
        }
      }
    }
  }
}
</script>

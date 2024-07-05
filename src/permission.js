import { getToken, removeToken, setToken } from '@/utils/auth'
import utils from '@/utils/utils'
import getPageTitle from '@/utils/get-page-title'
import router from './router'
import store from './store'
const loginPath = process.env.VUE_APP_LOGIN_PATH
const rootPath = process.env.VUE_APP_ROOT_PATH

const whiteList = [loginPath]

/**
 * 如果当前页面待着token过来,则种token
 */
function checkTokenAndSet() {
  const url = new URL(document.URL)
  const token = url.searchParams.get('token')
  if (!token) {
    return
  }
  setToken(token)
  // 设置完token以后,清除掉url上的token参数重新请求,如果token有效则直接进入页面,如果无效则会到登录页
  const newUrl = utils.removeUrlParam(document.URL, 'token')
  location.href = newUrl
}

router.beforeEach(async(to, from, next) => {
  document.title = getPageTitle(to.meta.title)

  checkTokenAndSet()

  const hasToken = getToken()
  store.commit('app/KEEP_ALIVE', to.name)

  if (hasToken) {
    if (to.path === loginPath) {
      next({ path: rootPath })
    } else {
      const gotUserInfo = store.getters.gotUserInfo
      if (gotUserInfo) {
        next()
      } else {
        try {
          await store.dispatch('user/getInfo')
          await store.dispatch('app/getApplicationList')
          const accessRoutes = await store.dispatch('GenerateRoutes')
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })
          next(to.fullPath)
        } catch (error) {
          removeToken()
          location.href = `${loginPath}?redirect=${location.href}`
          // next(`${loginPath}?redirect=${to.fullPath}`)
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      location.href = `${loginPath}?redirect=${location.href}`
      // next(`${loginPath}?redirect=${to.fullPath}`)
    }
  }
})

router.afterEach(() => {
  if (document.querySelector('.app-scrollbar-wrapper')) {
    document.querySelector('.app-scrollbar-wrapper').scrollTop = 0
  }
})

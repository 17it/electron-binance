import Layout from '@/components/common/index.vue'
import Vue from 'vue'
import Router from 'vue-router'
import { FormManage } from './modules/Form'
const rootPath = process.env.VUE_APP_ROOT_PATH

Vue.use(Router)

const asyncRouterNames = []

function formatRoutes(routes, parentItem) {
  for (let i = 0; i < routes.length; i++) {
    const item = routes[i]
    item.meta = item.meta || {}
    asyncRouterNames.push(item.name)
    if (!parentItem) {
      item.id = `${item.name}`
      item.meta.topIndex = i
    } else {
      // 保证三级及更多层级也有完整id
      item.id = `${parentItem.id || parentItem.name}-${item.name}`
      item.meta.topIndex = parentItem.meta.topIndex
    }
    if (item.children && item.children.length > 0) {
      formatRoutes(item.children, item)
    }
  }
}

export const asyncRouterMap = [
  {
    path: `${rootPath}`,
    component: Layout,
    redirect: `${rootPath}/index`,
    meta: { title: '首页' },
    children: [
      {
        path: `${rootPath}/index`,
        name: 'Platform',
        component: () => import('@/views/portal/home.vue'),
        meta: { title: '首页', icons: ['menu-icon-home.png', 'menu-icon-home-current.png'], onlyShow: true }
      }
    ]
  },
  ...FormManage, // 表单管理
  // 404 page must be placed at the end !!!
  {
    path: '*',
    component: () => import('@/views/exception/redirectLogic'),
    hidden: true
  }
]

formatRoutes(asyncRouterMap.filter(item => !item.hidden))

export const TempAsyncRouterMap = JSON.parse(JSON.stringify(asyncRouterMap))

export const constantRouterMap = [
  {
    path: `${rootPath}/404`,
    component: Layout,
    hidden: true,
    children: [
      {
        path: `${rootPath}/404`,
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
        meta: { title: '404', noTab: true }
      },
      {
        path: `${rootPath}/403`,
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
        meta: { title: '403', noTab: true }
      }
    ]
  }
]

export const routes = constantRouterMap

const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 解决报错
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
// push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  const showRouteNames = router.getRoutes().map(item => item.name)
  // 如果权限路由里有,当前路由里没有,则意味着没有权限 跳403
  // 如果权限路由和当前路由里都没有,则意味着没有这个路由 跳404
  if (asyncRouterNames.includes(location.name) && !showRouteNames.includes(location.name)) {
    return originalPush.call(this, '/403')
  } else if (!asyncRouterNames.includes(location.name) && !showRouteNames.includes(location.name)) {
    return originalPush.call(this, '/404')
  }
  return originalPush.call(this, location).catch(_ => {})
}
// replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(_ => {})
}

export default router

import { asyncRouterMap, constantRouterMap } from '@/router/index.js'
import user from './user.js'

/**
 * 过滤是否拥有某一个权限，并将菜单从加载列表移除
 */
function hasPermission(route) {
  const permissions = user.state.permissions
  if (route.meta && route.meta.permission) {
    return permissions.includes(route.meta.permission)
  }
  return true
}

function filterAsyncRouter(routerMap) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission

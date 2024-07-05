import { Message } from 'element-ui'
import { getStorage } from '@/utils/storage'
import { getAppList } from '@/api/dictionary'

const isSingleRun = window.top === window && !window.__POWERED_BY_QIANKUN__

const HomePage = {
  title: '首页',
  name: 'Platform',
  content: '/'
}

const state = {
  sidebar: {
    opened: true,
    showSidebar: isSingleRun,
    showToolTip: true // 是否开启文本省略提示
  },
  editableTabsValue: '1',
  homePage: HomePage,
  editableTabs: [HomePage],
  // 缓存页面的最大数，超过则把缓存最久切没有被访问的销毁
  maxPageNumber: 10,
  // 显隐顶导及菜单
  showCommonView: isSingleRun,
  isSingleRun: isSingleRun,
  // 主题色
  themeColor: '2023',
  menus: [],
  // 是否显示tab 默认显示
  showTab: true,
  // 用于tab页面刷新
  isRouterAlive: true,
  // 允许keepALive缓存的页面
  keepAliveComponents: [],
  // 左侧菜单当前展示
  currentActiveMenuIndex: 0,
  // 顶部导航栏当前选中态
  topMenuActiveIndex: -1,
  // 收藏菜单
  favouriteMenu: [],
  enums: {},
  currentApp: getStorage('currentBaseApp') || process.env.VUE_APP_ID,
  appOptions: [],
  appList: []
}

// 定义state的curtrent是某个值的计算属性 重新定义get
Object.defineProperty(state, 'currentTab', {
  get: function() { return state.editableTabs.find((tab) => tab.name === state.editableTabsValue) }
})

const mutations = {
  SET_CURRENTAPP(state, value) {
    state.currentApp = value
  },

  SET_ENUMS(state, enums) {
    state.enums = { ...state.enums, ...enums }
  },

  SET_TOP_MENU_ACTIVE_INDEX(state, index) {
    state.topMenuActiveIndex = index
  },

  SET_CURRENT_ACTIVE_MENU_INDEX(state, index) {
    state.currentActiveMenuIndex = index
  },

  SET_THRME_COLOR(state, color) {
    state.themeColor = color
  },

  TOGGLE_ROUTER_ALIVE(state) {
    state.isRouterAlive = !state.isRouterAlive
  },

  KEEP_ALIVE(state, componentName) {
    if (!state.keepAliveComponents.includes(componentName)) {
      state.keepAliveComponents.push(componentName)
    }
  },

  CANCEL_KEEP_ALIVE(state, componentName) {
    const index = state.keepAliveComponents.indexOf(componentName)
    index !== -1 && state.keepAliveComponents.splice(index, 1)
  },

  SET_KEEP_ALIVE(state, aliveArr = []) {
    state.keepAliveComponents = aliveArr
  },

  SET_MENUS(state, menus) {
    state.menus = menus
  },

  SHOW_SIDEBAR(state) {
    state.sidebar.showSidebar = true
  },

  HIDE_SIDEBAR(state) {
    state.sidebar.showSidebar = false
  },

  SET_EDITABLETABSVALUE(state, editableTabsValue) {
    state.editableTabsValue = editableTabsValue
  },

  SET_EDITABLETABS(state, editableTabItem) {
    state.editableTabs.push(editableTabItem)
  },

  DEL_EDITABLETAB(state, tabIndex) {
    state.editableTabs.splice(tabIndex, 1)
  },

  SET_EDITABLE_TABS(state, newTabs) {
    state.editableTabs = newTabs
  },

  TOGGLE_SIDEBAR(state) {
    state.sidebar.opened = !state.sidebar.opened
  },

  CLOSE_SIDEBAR(state) {
    state.sidebar.opened = false
  },

  OPEN_SIDEBAR(state) {
    state.sidebar.opened = true
  },

  SET_APP_OPTIONS(state, appOptions) {
    state.appOptions = appOptions
  },

  SET_APP_LIST(state, appList) {
    state.appList = appList
  },

  TOGGLE_FAVOURITE_MENU(state, menu) {
    const index = state.favouriteMenu.findIndex((item) => item.id === menu.id)
    if (index === -1) {
      if (state.favouriteMenu.length >= 5) {
        Message.info('常用菜单最多只能保存5个')
        return
      }
      state.favouriteMenu.push(menu)
    } else {
      state.favouriteMenu.splice(index, 1)
    }
    localStorage.setItem('favourite_menu', JSON.stringify(state.favouriteMenu))
  }
}

const filterEditableTabs = function(tab) {
  let filterRes = null
  state.editableTabs.forEach((item) => {
    if (tab.name === item.name) {
      filterRes = item
    }
  })
  return filterRes
}

const actions = {
  INIT_FAVOURITE_MENU({ commit, state }) {
    if (localStorage.getItem('favourite_menu')) {
      state.favouriteMenu = JSON.parse(localStorage.getItem('favourite_menu'))
    }
  },

  async addTab({ commit, state }, target) {
    if (target) {
      commit('SET_EDITABLETABSVALUE', target.name)
    }
    const targetRes = filterEditableTabs(target)
    if (!targetRes) {
      commit('SET_EDITABLETABS', target)
    }
  },

  getApplicationList({ commit }) {
    return new Promise((resolve, reject) => {
      getAppList().then(res => {
        if (res.code === 200) {
          const appData = res.data || []
          const appList = []
          const appOptions = appData.map((item) => {
            appList.push(item.code)
            return {
              value: item.code,
              label: item.name
            }
          })
          commit('SET_APP_OPTIONS', appOptions)
          commit('SET_APP_LIST', appList)
          resolve(true)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  removeTab({ commit, state }, targetName) {
    let delIndex = -1
    console.log(targetName)
    if (state.editableTabsValue === targetName) {
      state.editableTabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          delIndex = index
          const nextTab = state.editableTabs[index + 1] || state.editableTabs[index - 1]
          if (nextTab) {
            commit('SET_EDITABLETABSVALUE', nextTab.name)
          }
        }
      })
    } else {
      state.editableTabs.filter((item, index) => {
        if (item.name === targetName) {
          delIndex = index
        }
        return delIndex
      })
    }
    // 取消缓存
    commit('CANCEL_KEEP_ALIVE', targetName)
    if (delIndex) {
      commit('DEL_EDITABLETAB', delIndex)
    }
  },

  removeAllTab({ commit, state }) {
    // 关闭所有tab
    commit('SET_EDITABLE_TABS', [state.homePage])
    commit('SET_EDITABLETABSVALUE', HomePage.name)
    // 取消缓存
    commit('SET_KEEP_ALIVE')
  },

  removeAsideTab({ commit, state }, data) {
    // 关闭某一边tab
    let newTabs = []
    const len = state.editableTabs.length
    const { index, dir } = data
    const oldName = state.editableTabs[index].name
    if (dir === 'right') {
      // 关闭右边
      newTabs = state.editableTabs.slice(0, index + 1)
    } else {
      // 关闭左边
      newTabs = state.editableTabs.slice(index, len)
    }
    if (newTabs.length === 0 || newTabs[0].name !== 'Platform') {
      newTabs.unshift(state.homePage)
    }
    commit('SET_EDITABLETABSVALUE', oldName)
    commit('SET_EDITABLE_TABS', newTabs)
    // 取消缓存
    commit('SET_KEEP_ALIVE', newTabs.map((item) => item.name))
  },

  removeOtherTab({ commit, state }, index) {
    // 关闭其他tab
    const oldName = state.editableTabs[index].name
    const newTabs = []
    newTabs.push(state.editableTabs[index])
    if (newTabs[0].name !== 'Platform') {
      newTabs.unshift(state.homePage)
    }
    commit('SET_EDITABLETABSVALUE', oldName)
    commit('SET_EDITABLE_TABS', newTabs)
    // 取消缓存
    commit('SET_KEEP_ALIVE', newTabs.map((item) => item.name))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

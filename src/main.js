import App from '@/App.vue'
import permission from '@/directives/permission/index.js'
import '@/icons/index'
import store from '@/store'
import ElementUI from 'element-ui'
import Vue from 'vue'
import 'windi.css'
import './assets/styles/theme/index.css'
import './permission.js'
import router from './router'
import './utils/printProductInfo'
import './public-path'
import { setStorage, getStorage } from '@/utils/storage'
import Modules from '@/views/modules/index'

Vue.use(ElementUI, { size: 'small' })
Vue.use(permission)
Vue.use(Modules)

// 有接口以后这里要注释掉
// if (process.env.NODE_ENV === 'development') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.config.productionTip = false

Vue.config.devtools = true

let instance = null
function render(props = {}) {
  const { container } = props

  instance = new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
}

export async function mount(props) {
  const currentApp = getStorage('currentBaseApp')
  if (currentApp) {
    store.commit('app/SET_CURRENTAPP', currentApp)
  }
  console.log('currentApp', currentApp)
  props.onGlobalStateChange((state) => {
    // 监听状态变更
    if (state.currentApp) {
      console.log('state.currentApp', state.currentApp)
      setStorage('currentBaseApp', state.currentApp)
      store.commit('app/SET_CURRENTAPP', state.currentApp)
    }
  }, true)
  render(props)
}

export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
}

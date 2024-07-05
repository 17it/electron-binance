import ImCard from './ImCard.vue'
import ImDialog from './ImDialog.vue'
import ImDrawer from './ImDrawer.vue'
import ImForm from './ImForm'
import ImPagination from './ImPagination.vue'
import ImSearchArea from './ImSearchArea.vue'
import ImTable from './ImTable'
import ImTableArea from './ImTableArea.vue'
import ImWrapper from './ImWrapper.vue'

const Components = {}

// 系统常用的组件可以在这里注册成全局组件，避免页面内再引的麻烦
Components.install = (Vue) => {
  Vue.component('ImWrapper', ImWrapper)
  Vue.component('ImSearchArea', ImSearchArea)
  Vue.component('ImTableArea', ImTableArea)
  Vue.component('ImPagination', ImPagination)
  Vue.component('ImForm', ImForm)
  Vue.component('ImTable', ImTable)
  Vue.component('ImDrawer', ImDrawer)
  Vue.component('ImDialog', ImDialog)
  Vue.component('ImCard', ImCard)
}

export default Components

import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permissions
    if (!value) {
      return
    }

    if (value && Array.isArray(value)) {
      const selfPermissions = value

      const hasPermission = selfPermissions.some(item => {
        return permissions.includes(item)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      console.info('need permission! Like v-permission="[\'admin\',\'editor\']"')
    }
  }
}

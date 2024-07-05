import { getCurrentInfo } from '@/api/employees'
import { removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: '',
    accountType: 0,
    fullname: '',
    username: '',
    departmentName: '',
    orgLongName: '',
    avatar: '',
    email: '',
    tenantCode: '',
    personId: '',
    expire: 0,
    mobile: '',
    objectCode: 0,
    orgId: '',
    orgName: '',
    hrmDeptId: '',
    roles: [],
    permissions: [],
    gotUserInfo: false,
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },

  SET_NAME(state, fullname) {
    state.fullname = fullname
  },

  SET_TOKEN_KEY(state, tokenKey) {
    state.tokenKey = tokenKey
  },

  SET_AVATAR(state, avatar) {
    state.avatar = avatar
  },

  SET_USER_NAME(state, userName) {
    state.username = userName
  },

  SET_OBJECT_CODE(state, objectCode) {
    state.objectCode = objectCode
  },

  SET_EMAIL(state, email) {
    state.email = email
  },

  SET_ACCOUNT_TYPE(state, accountType) {
    state.accountType = accountType
  },

  SET_DEPARTMENT_NAME(state, departmentName) {
    state.departmentName = departmentName
  },

  SET_ORG_LONG_NAME(state, orgLongName) {
    state.orgLongName = orgLongName
  },

  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions
  },

  SET_GOTUSERINFO(state, gotUserInfo) {
    state.gotUserInfo = gotUserInfo
  },

  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      // 强校验
      getCurrentInfo()
        .then((res) => {
          if (res.code === 200) {
            const { permissionFlagList } = res.data
            // 权限列表
            commit('SET_PERMISSIONS', permissionFlagList || [])
            commit('SET_GOTUSERINFO', true) // 标记已获取用户信息
            commit('SET_USERINFO', res.data) // 标记已获取用户信息
            resolve(res.data)
          } else {
            // 如果获取用户信息失败,则认为token无效,这时候需要清除token
            removeToken()
          }
        })
        .catch((err) => {
          reject(err)
          removeToken()
        })
    })
  },

  setAccountType({ commit }, no) {
    commit('SET_ACCOUNT_TYPE', no)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

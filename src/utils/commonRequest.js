import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_COMMON_API,
  timeout: 300000
})

// Request 拦截
service.interceptors.request.use(
  (config) => {
    // header加token
    if (getToken()) {
      config.headers.Authorization = getToken()
    }
    config.headers.app = process.env.VUE_APP_ID
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response 拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  (error) => {
    // 先关闭其他弹框
    Message.closeAll()
    Message({
      message: '系统升级中，请稍后再试！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

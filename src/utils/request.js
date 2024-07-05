import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import axios from 'axios'
import { getStorage } from '@/utils/storage'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 300000
})

// Request 拦截
service.interceptors.request.use(
  (config) => {
    // header加token
    if (getToken()) {
      config.headers.Authorization = getToken()
    }

    // 区分平台
    config.headers.app = getStorage('currentBaseApp')
    // config.headers.platSource = 1

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
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

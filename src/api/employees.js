import request from '@/utils/request.js'

/**
 * 获取当前用户信息
 */
export function getCurrentInfo(params) {
  return request({
    url: '/qxcollege/admin/employee/info',
    method: 'get',
    params
  })
}

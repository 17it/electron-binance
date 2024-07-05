import request from '@/utils/request.js'

/***
 * 登录
 */
export function login(data) {
  return request({
    url: '/qxcollege/admin/sso/login',
    method: 'post',
    data
  })
}

import request from '@/utils/request.js'

/***
 * 获取应用列表
 */
export function getAppList(params) {
  return request({
    url: '/control/admin/app/list',
    method: 'get',
    params
  })
}

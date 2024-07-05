import request from '@/utils/request.js'

/**
 * 获取表单列表
 */
export function getActivityList(params) {
  return request({
    url: '/activity-admin/activity/list',
    method: 'get',
    params
  })
}

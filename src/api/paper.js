import request from '@/utils/request.js'

/**
 * 获取表单列表
 */
export function getFormList(params) {
  return request({
    url: '/base/form/query',
    method: 'get',
    params
  })
}

/**
 * 获取表单详情
 */
export function getFormDetail(params) {
  return request({
    url: `/base/form/get/${params.objectCode}`,
    method: 'get',
    params: {}
  })
}

/**
 * 添加表单
 */
export function addFormItem(data) {
  return request({
    url: '/base/form/save',
    method: 'post',
    data
  })
}

/**
 * 删除表单
 */
export function deleteFormItem(data) {
  return request({
    url: `/base/form/delete/${data.formCode}`,
    method: 'post',
    data
  })
}

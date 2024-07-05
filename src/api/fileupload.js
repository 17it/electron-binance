import request from '@/utils/commonRequest.js'

/**
 * 添加文件上传信息
 */
export function findAliToken() {
  return request({
    url: '/qxcollege/admin/fileUpload/findAliToken',
    method: 'post',
    data: {}
  })
}

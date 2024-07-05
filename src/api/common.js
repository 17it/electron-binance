// 项目中用到的公共接口文件
import request from '@/utils/commonRequest.js'

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

/**
 * 部门列表
 */
export function qxcollegeDepartmentList(params) {
  return request({
    url: '/qxcollege/admin/department/list',
    method: 'get',
    params
  })
}

/**
 * 获取枚举数据
 * app: 确定返回哪个平台的数据
 * QuanXuan  用户运营平台
 * Contract  合同
 * CChuang   C创
 * control   控制中心
 * IClub     IClub
 * Mms       物资管理系统
 */
export function getAllDictionaryItems(params) {
  return request({
    url: '/qxcollege/admin/dictionary/tree',
    method: 'get',
    params
  })
}

/**
 * 获取员工下拉筛选
 *
 * 这里使用的是审批的接口 因为审理里departmentName有数据
 * 如果回头这个接口有数据以后，理论上是应该使用这个接口的
 * '/qxcollege/admin/employee/employeeSelectOption'
 *
 */
export function employeeSelectOption(data) {
  return request({
    url: '/flow/engine/formData/employeeSelectOption',
    method: 'post',
    data
  })
}

/**
 * 地址解析
 */
export function analysisAddress(data) {
  return request({
    url: '/base/address/analysis',
    method: 'post',
    data
  })
}

/***
 * 会台账列表
 */
export function getMeetingList(data) {
  return request({
    url: '/qxcollege/meeting/standingBook/standingBookListV2',
    method: 'post',
    data
  })
}

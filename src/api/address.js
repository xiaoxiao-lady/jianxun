import request from '@/apiconfig/index'

/**
 * [getAddress 【收货地址】获取收货地址，百分之百返回一个。前端注意是否有手机号]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getAddress (data) {
  return request({
    url: '/front/address/getAddress',
    method: 'post',
    params: data
  })
}

/**
 * [getAddress 【病区管理】获取树形结构]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getAddressTree (data) {
  return request({
    url: '/front/address/patient/getTree',
    method: 'post',
    params: data
  })
}

/**
 * [updateAddress 更新收货地址]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateAddress (data) {
  return request({
    url: '/front/address/update',
    method: 'post',
    params: data
  })
}

export function getBuildAndAreaAndBedOrOffice (data) {
  return request({
    url: '/front/address/patient/getBuildAndAreaAndBedOrOffice',
    method: 'post',
    params: data
  })
}
//【订餐员/建筑无】不分页获取自己的建筑物列表)
export function getBuild (data) {
  return request({
    url: '/front/address/taker/area/getBuild',
    method: 'post',
    params: data
  })
}


import request from '@/apiconfig/index'

/**
 * [getMemberPageQuery 【用户相关】分页获取列表(职工、点餐员、病患)]
 * @param  {[type]} data [description]
 * {
 *  type 用户类型：1职工，2点餐员，3病患
 *  areaId: 病区ID：
 * }
 * @return {[type]}      [description]
 */
export function getMemberPageQuery (data) {
  return request({
    url: '/front/member/pageQuery',
    method: 'post',
    params: data
  })
}

// 通过病区获取病床（病患信息）
export function bedQueryByAreaId (data) {
  return request({
    url: '/front/address/taker/bed/queryByAreaIdWithoutPatient',
    method: 'post',
    params: data
  })
}

// 订餐员通过手机号不分页查询病人信息
export function queryPatientByMobile (data) {
  return request({
    url: '/front/member/queryPatientByMobileOnTaker',
    method: 'post',
    params: data
  })
}

// 订餐员通过手机号不分页查询病人信息
export function patientCreate (data) {
  return request({
    url: '/front/member/patient/create',
    method: 'post',
    params: data
  })
}
//获取验证码
export function sendCode(data) {
  return request({
    url: '/front/validateCode/send',
    method: 'post',
    params: data
  })
}
//修改密码
export function updatePassword(data) {
  return request({
    url: '/front/member/updatePassword',
    method: 'post',
    params: data
  })
}
//修改手机号
export function updateMobile(data) {
  return request({
    url: '/front/member/updateMobile',
    method: 'post',
    params: data
  })
}
//登录用户信息
export function getMemberInfo (data) {
  return request({
    url: '/front/member/getMemberInfo',
    method: 'post',
    params: data
  })
}

//登出
export function loginOut(data) {
  return request({
    url: '/front/member/loginOut',
    method: 'post',
    params: data
  })
}
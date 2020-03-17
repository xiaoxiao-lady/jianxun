/**
 * 引入fetch、baseUrl
 * @param params
 * @returns {*}
 */
// import {fetch, baseUrl} from 'config/index'
import request from '@/apiconfig/index'
// // 登录接口
// export function loginUserNo (params) {
//   return fetch(`${baseUrl}/company/user/login`, params)
// }
// /front/member/employee/login
// 统计
export function getTakerIndex (data) {
  return request({
    url: '/front/common/getTakerIndex',
    method: 'post',
    params: data
  })
}


import request from '@/apiconfig/index'

// 用户名登录
export function loginByUsername (data) {
  return request({
    // url: '/front/member/employee/login',
    url: '/front/member/taker/login',
    method: 'post',
    params: data
  })
}

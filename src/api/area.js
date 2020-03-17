
import request from '@/apiconfig/index'

/**
 * [getAreaList 获取病区列表]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getAreaList (data) {
  return request({
    url: '/front/address/taker/area/getArea',
    method: 'post',
    params: data
  })
}


//获取灶类
export function kitchenQuery (data) {
  return request({
    url: '/front/common/kitchen/query',
    method: 'post',
    params: data
  })
}

//通过灶类获取医嘱
export function adviceQuery (data) {
  return request({
    url: '/front/common/query',
    method: 'post',
    params: data
  })
}
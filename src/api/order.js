
import request from '@/apiconfig/index'

// 获取订单列表
export function getOrderList (data) {
  return request({
    url: '/front/order/pageQuery',
    method: 'post',
    params: data
  })
}

/**
 * [createOrder 创建订单]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createOrder (data) {
  return request({
    url: '/front/order/create',
    method: 'post',
    params: data
  })
}

/**
 * [payOrder 去支付]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function payOrder (data) {
  return request({
    url: '/front/pay/prepay',
    method: 'post',
    data: data
  })
}

/**
 * [payOrder 去支付]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function ccbPayOrder (data) {
  return request({
    url: '/front/pay/ccb/prepay',
    method: 'post',
    data: data
  })
}

/**
 * [getOrderDetail 获取单个详情]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getOrderDetail (data) {
  return request({
    url: '/front/order/get',
    method: 'post',
    data: data
  })
}

/**
 * [cancelOrder 取消订单]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function cancelOrder (data) {
  return request({
    url: '/front/order/cancel',
    method: 'post',
    data: data
  })
}

/**
 * [refundOrder 退款]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function refundOrder (data) {
  return request({
    url: '/front/pay/refund',
    method: 'post',
    data: data
  })
}

// /front/order/getPatientToday
/**
 * [getPatientTodayOrder 订单管理】获取病患今日所点餐别]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getPatientTodayOrder (data) {
  return request({
    url: '/front/order/getPatientToday',
    method: 'post',
    data: data
  })
}

//订单确认送达
export function orderSendConfirm (data) {
  return request({
    url: '/front/order/confirm',
    method: 'post',
    data: data
  })
}

//订单评价
export function orderComment (data) {
  return request({
    url: '/front/order/comment',
    method: 'post',
    data: data
  })
}

//获取卡片更新信息
export function getCardInfo (params) {
  return request({
    url: '/front/card/tcyy/getBalance',
    method: 'post',
    params
  })
}


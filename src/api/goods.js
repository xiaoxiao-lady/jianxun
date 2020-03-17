
import request from '@/apiconfig/index'

// 获取通知
export function getNoticeList (data) {
  return request({
    url: '/front/common/notice/getNotice',
    method: 'post',
    params: data
  })
}

/**
 * [getMenuByDate 【菜单管理】获取可预定菜单（1职工，2订餐员 3病患）]
 * @param  {[type]} data [description
 * {
 *  type: 1
 * }
 * @return {[type]}      [description]
 */
export function getMenuByDate (data) {
  return request({
    url: '/front/common/menu/getByDate',
    method: 'post',
    params: data
  })
}

/**
 * [getCart 获取购物车]
 * @param  {[type]} data [description]
 * {
    type: 3类型.1职工，2订餐员 3病患，4包厢
 * }
 * @return {[type]}      [description]
 */
export function getCart (data) {
  return request({
    url: '/front/cart/getCart',
    method: 'post',
    params: data
  })
}

/**
 * [addCart 购物车】加入购物车(数量系统默认1)]
 * @param {[type]} data [description]
 * {
 *  classId
 *  data,
 *  productId 产品ID
 *  type 类型.1职工，2订餐员,3病患，4包厢
 * }
 */
export function addCart (data) {
  return request({
    url: '/front/cart/addCart',
    method: 'post',
    params: data
  })
}

/**
 * [updateCart 【购物车】更新购物车数量(正负数)。数量递减为0，系统会删除该条数据]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateCart (data) {
  return request({
    url: '/front/cart/updateCart',
    method: 'post',
    params: data
  })
}

/**
 * [empty 【清空购物车】]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function empty (data) {
  return request({
    url: '/front/cart/clearCart',
    method: 'post',
    params: data
  })
}

/**
 * [confirmCart description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function confirmCart (data) {
  return request({
    url: '/front/cart/confirm',
    method: 'post',
    params: data
  })
}

import request from '@/apiconfig/index'

/**
 * [getCanteenList 获取餐厅列表]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function getCanteenList (data) {
  return request({
    url: '/front/common/canteen/query',
    method: 'post',
    params: data
  })
}

/* eslint-disable */ 
import request from '@/apiconfig/index'

// list
export function monthReport(data) {
    return request({
        url: '/front/common/getTakerMonth',
        method: 'post',
        params: data
    })
}
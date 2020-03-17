/* eslint-disable */ 
import request from '@/apiconfig/index'

// list
export function getNoticeList(data) {
    return request({
        url: '/front/notice/query',
        method: 'post',
        params: data
    })
}

// detail
export function getNoticeDetail(data) {
    return request({
        url: '/front/notice/get',
        method: 'post',
        params: data
    })
}

import request from '@/utils/request'

export function getPaperList(data) {
  return request({
    url: '/paper/list',
    method: 'get',
    params: data
  })
}

export function viewExamRecord(data) {
  return request({
    url: '/paper/view',
    method: 'get',
    params: data
  })
}
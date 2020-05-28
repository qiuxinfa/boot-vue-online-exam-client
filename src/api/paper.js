import request from '@/utils/request'

export function getPaperList(data) {
  return request({
    url: '/paper/list',
    method: 'get',
    params: data
  })
}

export function viewPaper(data) {
  return request({
    url: '/paper/view',
    method: 'get',
    params: data
  })
}

export function addPaper(data) {
  return request({
    url: '/paper/add',
    method: 'post',
    data
  })
}
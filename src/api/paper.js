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

export function createPaper(data) {
  return request({
    url: '/paper/createPaper',
    method: 'post',
    data
  })
}

export function updatePaper(data) {
  return request({
    url: '/paper/update',
    method: 'post',
    data
  })
}

//获取各种题型数量
export function getCount() {
  return request({
    url: '/paper/count',
    method: 'get'
  })
}
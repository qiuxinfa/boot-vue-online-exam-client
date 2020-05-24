import request from '@/utils/request'

export function getFillList(data) {
  return request({
    url: '/fill/list',
    method: 'get',
    params: data
  })
}

export function getJudgeList(data) {
  return request({
    url: '/judge/list',
    method: 'get',
    params: data
  })
}

export function getSingleList(data) {
  return request({
    url: '/single/list',
    method: 'get',
    params: data
  })
}

export function getMultiList(data) {
  return request({
    url: '/multi/list',
    method: 'get',
    params: data
  })
}
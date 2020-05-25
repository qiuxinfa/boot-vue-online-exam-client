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

export function addFill(data) {
  return request({
    url: '/fill/add',
    method: 'post',
    data
  })
}

export function addJudge(data) {
  return request({
    url: '/judge/add',
    method: 'post',
    data
  })
}

export function addSingle(data) {
  return request({
    url: '/single/add',
    method: 'post',
    data
  })
}

export function addMulti(data) {
  return request({
    url: '/multi/add',
    method: 'post',
    data
  })
}
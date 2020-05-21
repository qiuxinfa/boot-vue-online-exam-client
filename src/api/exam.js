import request from '@/utils/request'

export function getExamList(data) {
  return request({
    url: '/exam/list',
    method: 'get',
    params: data
  })
}

export function getExamDetail(data) {
  return request({
    url: '/exam/detail',
    method: 'get',
    params: data
  })
}

export function addExamRecord(data) {
  return request({
    url: '/examRecord/add',
    method: 'post',
    data
  })
}

export function getExamRecordList(data) {
  return request({
    url: '/examRecord/list',
    method: 'get',
    params: data
  })
}
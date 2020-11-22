import request from '@/utils/request'

export function getQuestionList(data) {
  return request({
    url: '/question/list',
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

export function exportQuestionList() {
  return request({
    url: '/question/exportExcel',
    method: 'post',
    responseType: 'blob'
  })
}

export function exportTemplate() {
  return request({
    url: '/question/template/download',
    method: 'post',
    responseType: 'blob'
  })
}

export function importQuestions(data) {
  return request({
    url: '/question/import',
    method: 'post',
    data: data,
    headers: {'Content-Type': 'multipart/form-data' }
  })
}

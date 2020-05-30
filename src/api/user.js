import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getMenu(id) {
  return request({
    url: '/auth/menu',
    method: 'get',
    params: {userId:id}
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete',
    method: 'post',
    params: id
  })
}

export function upload(data) {
  return request({
    url: '/user/upload',
    method: 'post',
    data
  })
}

export function refreshToken(token) {
  return request({
    url: '/auth/refreshToken',
    method: 'get',
    params: { token }
  })
}


export function getRoleList() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

import Cookies from 'js-cookie'
import axios from 'axios'

const TokenKey = 'token_key'
const tokenExpriredKey = 'token_exprired_key'
const userKey = 'user_key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log("设置新的token: "+token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTokenExpriredTime() {
  return Cookies.get(tokenExpriredKey)
}

export function setTokenExpriredTime(tokenExpriredTime) {
  console.log("设置新的过期时间: "+tokenExpriredTime)
  return Cookies.set(tokenExpriredKey, tokenExpriredTime)
}

export function getUser() {
  return Cookies.get(userKey)
}

export function setUser(user) {
  console.log("设置新的user: "+user)
  return Cookies.set(userKey, user)
}
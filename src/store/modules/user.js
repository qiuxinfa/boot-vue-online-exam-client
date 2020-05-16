import { login, logout, getInfo,refreshToken } from '@/api/user'
import { setUser, setToken, removeToken, setTokenExpriredTime,getTokenExpriredTime } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: '',
  tokenExpiredTime: '',
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKEN_EXPIRED_TIME: (state, tokenExpiredTime) => {
    state.tokenExpiredTime = tokenExpiredTime
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        debugger
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        commit('SET_TOKEN_EXPIRED_TIME',data.tokenExpiredTime)
        setTokenExpriredTime(data.tokenExpiredTime)
        // console.log("user 类型 "+ (typeof data.user) )
        debugger
        let userObj = eval('(' + data.user + ')')
        setUser(userObj)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  toRefreshToken({ commit, state }) {
    debugger
    return new Promise((resolve, reject) => {
      refreshToken(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('refreshToken failed, please Login again.')
        }
        console.log("开始设置token: "+data.token)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        commit('SET_TOKEN_EXPIRED_TIME',data.tokenExpiredTime)
        setTokenExpriredTime(data.tokenExpiredTime)
        console.log("开始返回数据data: "+data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

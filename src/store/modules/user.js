import { getMenu, login, logout, getInfo,refreshToken} from '@/api/user'
import { setUser,getUser,setUserId,getUserId,setUsername, getUsername,setToken, getToken, setTokenExpriredTime,getTokenExpriredTime } from '@/utils/auth'
import { resetRouter } from '@/router'
import {  Message } from 'element-ui'

const state = {
  token: '',
  curUser: '',
  tokenExpiredTime: '',
  name: '',
  id: '',
  avatar: '',
  menuList: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    console.log("vuex set token "+token)
    state.token = token
  },
  SET_TOKEN_EXPIRED_TIME: (state, tokenExpiredTime) => {
    state.tokenExpiredTime = tokenExpiredTime
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER: (state, user) => {
    state.curUser = user
  },
  SET_MENU: (state, menu) => {
    state.menuList = menu
  },
  // 页面刷新时防止信息丢失可以掉用本地存储获取用户信息
  initUser: (state) => {
    // debugger
    let user = getUser()
   // console.log("initUser当前用户str；"+user)
    if(user){
      // state.menuList = ''
      // resetRouter()
      state.curUser = JSON.parse(user)
      //console.log("initUser当前用户；"+(state.curUser))
      state.id = state.curUser.id
      state.name = state.curUser.username
      state.avatar = state.curUser.photoUrl
      state.token = getToken()
    }
  },

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // debugger
        if(response.data.code == 200){
          const { data } = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          commit('SET_TOKEN_EXPIRED_TIME',data.tokenExpiredTime)
          setTokenExpriredTime(data.tokenExpiredTime)
          //设置name和头像
          commit('SET_NAME', data.user.username)
          commit('SET_ID',data.user.id)
          commit('SET_AVATAR', data.user.photoUrl)
          let userId = data.user.id
          setUserId(data.user.id)
          setUser(data.user)
          setUsername(data.user.username)
          console.log("登录成功")
          Message({
                    message: '登录成功!',
                    type: 'success'
                  });
          resolve()
        }else{
          Message({
                    message: response.data.msg,
                    type: 'error'
                  });
          reject(error)
        }
      }).catch(error => {
        console.log("登录失败 "+error)
        reject(error)
      })
    })
  },
  // get menu list
  getMenuList({ commit, state }) {
   // debugger
    console.log("user menu userId "+getUserId())
    return new Promise((resolve, reject) => {
      getMenu(getUserId()).then(response => {
        debugger
       // console.log("请求menu结束.."+response.data.data[0].url)
        // 设置菜单权限
        commit('SET_MENU', response.data.data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  toRefreshToken({ commit, state }) {
    debugger
    return new Promise((resolve, reject) => {
      refreshToken(state.token).then(response => {
        const { data } = response.data
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
        const { data } = response.data

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
        // 清空权限菜单
        commit('SET_MENU', '')
        commit('SET_TOKEN', '')
        setUserId('')
        setUser('')
        setToken('')
        resetRouter()
        Message({
                  message: '已退出登录!',
                  type: 'success'
                });
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
      setToken('')
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

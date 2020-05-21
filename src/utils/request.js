import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from "@/router"
import { setUsername, getUsername, setToken, getToken, setTokenExpriredTime, getTokenExpriredTime } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // let beforeToken =  getToken()
    // console.log("刷新前token: "+beforeToken)
    if (store.getters.token) {
      //刷新token的第1种方法: 预处理,在过期前后允许的时间内,刷新token

        //判断token是否过期
      //   if (getTokenExpriredTime()){
      //     let t1 = getTokenExpriredTime()
      //     let t2 = Date.now()
      //     let diffTime = t1 - t2
      //     console.log("刷新前过期时间: "+t1)
      //     console.log("当前时间: "+t2)
      //     //token过期前后5分钟内,去刷新token
      //     if(Math.abs(diffTime)<= 1000*60*1){
      //           console.log("开始刷新token: "+diffTime)
      //           doRefreshToken()
      //      }
      //      //token过期超过5分钟,重新登录
      //      if ((-diffTime) > 1000*60*1) {
      //        console.log("开始重新登录")
      //          Message.error('登陆已过期,请重新登陆！')
      //          setToken('')
      //          setTokenExpriredTime('')
      //          //跳转到登录页
      //          router.push({
      //            name: 'login'
      //          })
      //      }
      // }
      // let t3 = getTokenExpriredTime()
      // console.log("刷新后过期时间: "+t3)
      // let afterToken =  getToken()
      // console.log("刷新后token: "+afterToken)

      config.headers['Authorization'] = getToken()
    }

    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    debugger
    return response
    // const status = response.state
    // if(status == 200){
    //   return resData
    // }
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    console.log('err' + error) // for debug
    debugger
    //刷新token的第2种方法: 后端返回401,表示在过期后允许的时间内,刷新token
    if (error.response) {
      if (error.response.status === 401) {
         doRefreshToken(error)
        // 如果当前路由不是login，并且用户有 “记住密码” 的操作
        //那么去请求新 token
        if (router.currentRoute.name !== 'login') {
          //过期后1分钟之内,可以刷新token
          let diff = Date.now() - getTokenExpriredTime()
          if (diff >0 && diff <= 1000*60*5 ) {
            console.log("返回401后,开始刷新token")
            //刷新token,并且继续发送原来的请求
            return doRequest(error)
          } else {
            console.log("返回401后,开始返回登录页")
            Message.error('登陆过期请重新登陆啊！')
            setToken('')
            setTokenExpriredTime('')
            router.push({
              name: 'login'
            })
          }
        }
      }
   }

   //拒绝请求
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    // return Promise.reject(error)
  }
)

async function doRefreshToken(){
    const result = await axios.post('http://localhost:8888/user/refreshToken',{ token: getToken(),username: getUsername()})
    debugger
    if(result.data.token){
      console.log("开始更新token")
      //更新token
      setToken(result.data.token)
      //更新token失效时间
      setTokenExpriredTime(result.data.tokenExpiredTime)
    }else{
      console.log("条件不符合,不更新token: "+result)
    }
}

async function doRequest (error) {
  const result = await axios.post('http://localhost:8888/user/refreshToken',{ token: getToken(),username: getUsername()})
  debugger
  console.log("doRequest刷新token返回的数据: "+result)
  let token = result.data.token
  let tokenExpiredTime = result.data.tokenExpiredTime
  console.log("doRequest返回token: "+token)
  console.log("doRequest开始更新token")
  //更新token
  setToken(token)
  //更新token失效时间
  setTokenExpriredTime(tokenExpiredTime)

  let config = error.response.config
  config.headers['Authorization'] = getToken()
  //发送之前的请求
  const res = await axios.request(config)

  return res
}

export default service

import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { asyncRoutes } from './router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
var getRouter;

function hasPermission(authList, route) {
    if (route.meta && route.meta.authStr) {
        return authList.some(auth => route.meta.authStr === auth.url);
    }
    return true;
}

export function filterAsyncRoutes(routes, authList) {
    const res = [];
    routes.forEach(route => {
        const tmp = route;
        if (hasPermission(authList, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, authList);
            }
            res.push(tmp);
        }
    });
    return res;
}

function routerGo(to, next, authList) {
    debugger
    let routes  = asyncRoutes
    getRouter = filterAsyncRoutes(routes, authList);
    router.options.routes = getRouter;
    router.addRoutes(getRouter);
    // global.antRouter = getRouter;
    next({ ...to, replace: true });
}
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetMenuList = store.getters.menuList
      //console.log("当前菜单  "+hasGetMenuList)
      //如果已经获取菜单了
      //debugger
      if (hasGetMenuList) {
        //console.log("进入下一个  ")
        next()
      } else {
        try {
          // get menu list
          // console.log("开启请求菜单")
          let re = await store.dispatch('user/getMenuList').then((ress) => {
            //console.log("menu请求成功"+ress.data.data)
          }).catch((err) => {
           // console.log("menu请求失败")
          })
          //debugger
          routerGo(to, next, store.getters.menuList);
          next()
        } catch (error) {
          // remove token and go to login page to re-login

          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

/**
 * 封装 axios 请求模块
 */
// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store和在组件中this.$store是一个东西
import axios from "axios"
import JSONbig from 'json-bigint'
import store from '@/store/'
import { Toast } from 'vant'
import router from "@/router/"

// 单独创建一个拦截器
const refreshTokenReq = axios.create({
  baseURL: "http://ttapi.research.itcast.cn/",// 基础路径
})
const request = axios.create({
  baseURL: "http://ttapi.research.itcast.cn/",// 基础路径
  transformResponse: [function (data) {
    try {
      // console.log('转换成功');
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err);
      return data
    }
  }]
})
// 请求拦截器,任何请求发送都会经过请求拦截器
request.interceptors.request.use(function (config) {
  // 如果用户已经登录，统一给接口设置 token 信息
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config;
}, function (error) {

  return Promise.reject(error);
});
// 响应拦截器,解决token过期，解决状态码问题
request.interceptors.response.use(function (response) {
  // 响应成功来到这里
  // Do something with response data
  return response;
}, async function (error) {
  // 请求响应失败来到这里
  // 超过2xx的状态码都会来到这里
  const status = error.response.status
  if (status === 400) {
    // 客户端请求参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token 无效
    const { user } = store.state
    // 如果没有 user 或者 user.token 直接去登录
    if (!user || !user.token) {
      // 直接跳转到登录页面
      return redirectLogin()
    }
    // 使用 refresh_token 请求获取新的token
    try {
      // 使用一个新的拦截器，避免出现请求失败的死循环
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 拿到新的token之后把它更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)
      // error.config是本次请求的相关的信息配置对象
      // 他的请求拦截器通过 store 容器访问 token 数据
      return request(error.config)
    } catch (error) {
      redirectLogin()
    }

    // 把失败的请求重新发出去
  } else if (status === 403) {
    // 没有操作权限
    Toast.fail('没有操作权限')

  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务端异常请稍后重试')

  }
  function redirectLogin() {
    router.replace({
      name: 'login',
      // 查询参数会以 ？ 作为分隔符放到url后面
      query: {
        // 数据名随便取
        // 得到当前路由路径
        redirect: router.currentRoute.fullPath,

      }
    })
  }
  // 抛出异常
  return Promise.reject(error);
});
export default request 
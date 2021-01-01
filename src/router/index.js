import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from "@/store/"

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: { requiresAuth: false } // 添加额外的自定义数据
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requiresAuth: false } // 添加额外的自定义数据

  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    // 将路由参数映射到组件的 props 中，无论是访问还是维护都很方便
    props: true,
    meta: { requiresAuth: false } // 添加额外的自定义数据

  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
    meta: { requiresAuth: false } // 添加额外的自定义数据

  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/home/'),
        meta: { requiresAuth: false } // 添加额外的自定义数据

      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('../views/qa/'),
        meta: { requiresAuth: true } // 添加额外的自定义数据

      },
      {
        path: '/videos',
        name: 'videos',
        component: () => import('../views/videos/'),
        meta: { requiresAuth: false } // 添加额外的自定义数据
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: { requiresAuth: false } // 添加额外的自定义数据

      },
    ]
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat'),
    meta: { requiresAuth: true } // 添加额外的自定义数据
  },
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to :要访问的页面路由信息
  // from：来自哪个页面的路由信息
  // next：放行的标记
  if (to.meta.requiresAuth) {

    // 校验登录状态
    if (store.state.user) {
      next()
      return
    }
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录',
    }).then(() => { // 确认执行这里
      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }

      }
      )
    }).catch(() => { // 取消执行这里
      // 取消了，终端停止路由导航
      next(false)
    })
  } else {
    // 不需要登录的页面直接过去
    next()
  }
})
export default router

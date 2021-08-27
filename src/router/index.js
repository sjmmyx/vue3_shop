import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

const routes = [
  // 重定向路径
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect:'welcome',
    children:
      [
        {path:'/welcome',component:Welcome},
        {path:'/users',component:Users}
      ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是登录页就直接放行
  if (to.path === '/login') return next()
  // 访问非登陆页面，1.获取TOKEN
  const tokenStr = window.sessionStorage.getItem("token")
  // 如果token不存在直接跳转登录页
  if(!tokenStr) return next('/login')
  // token存在的话就放心
  next()
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'
import Article from './components/article/Article.vue'
import AddArticle from './components/article/AddArticle.vue'
import Role from './components/rights/Role.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/user',
        component: User
      },
      {
        path: '/article',
        component: Article
      },
      {
        path: '/article/add',
        component: AddArticle
      },
      {
        path: '/role',
        component: Role
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫，没有登录的用户不能访问其他页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
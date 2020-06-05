import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Right from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Carts from '../components/goods/Carts.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/Goodslists.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'
Vue.use(VueRouter)

  const routes = [
    // 路由地址
  {path:'/login',component:Login},
  {path:'/',redirect:'/login'},

  {path:'/home',component:Home,redirect:'/welcome',
  children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:User},
      {path:'/rights',component:Right},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Carts},
      {path:'/params',component:Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order},
      {path:'/reports',component:Report},
    ]
  }
]

const router = new VueRouter({
  routes
})
// 为路由对象，添加beforeEach导航守卫 目的是防止用户没有登陆就能进入其他页面
// to将要访问的页面路径，from从哪个页面跳转而来的，next()表示放行
router.beforeEach((to,from,next)=>{
  // 如果用户访问的是登录页，直接放行
  if(to.path==='/login'){
    return next();
  }
  // 判断用户是否登陆过，从sessionstorige中获取token值
  const tokenStr=window.sessionStorage.getItem('token');
  if(!tokenStr){
    // 没有登陆，强制跳转到登录页
    return next('/login');
  }
  next()
})
export default router

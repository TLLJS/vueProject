import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式文件
import './assets/css/global.css'
// 导入字体图标样式文件
import './assets/fonts/iconfont.css'
// 倒入树形结构插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入文本编辑器样式表
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//把文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
import axios from 'axios'
// 注册为全局组件
Vue.component('tree-table',TreeTable)
// 格式化时间的全局过滤器
Vue.filter('dataTime',function(origin){
  const date=new Date(origin)
  const year=date.getFullYear()
  const month=(date.getMonth()+1)>9?date.getMonth()+1:'0'+(date.getMonth()+1)
  const day=date.getDate()>9?date.getDate():'0'+date.getDate()
  const hour=date.getHours()>9?date.getHours():'0'+date.getHours()
  const min=date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes()
  const second=date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds()
  return `${year}-${month}-${day} ${hour}:${min}:${second}`
})
Vue.config.productionTip = false
// 配置axios的请求根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截器
axios.interceptors.request.use(config=>{
  // 根据服务器后端文档说明为请求头对象添加Token验证的Authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config

})
// 将axios挂载到Vue的原型对象，进而能够发送请求
Vue.prototype.axios=axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

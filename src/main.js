import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import './plugins/element.js'
import './plugins/common.js'
import './assets/css/global.css'
import axios from 'axios'
import moment from 'moment'

// 设置api请求的基本路由
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1'
// axios.defaults.baseURL = 'http://sping.site/spy/api/v1'
axios.defaults.baseURL = 'http://127.0.0.1:19531/spy/api/v1'

// 挂载axios
Vue.prototype.$http = axios
// Headers里面设置Authorization
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  return config
})
// 时间格式化
Vue.filter('formatTime', function(data, timeset='YYYY-MM-DD HH:mm:ss') {
  return moment(data).format(timeset)
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugin/element'

//引入nprogress
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
//引入axios
import axios from 'axios';
//设置根请求路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//添加拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=sessionStorage.getItem('LoginCredential');
  //开启进度条
  NProgress.start();
  return config
})
axios.interceptors.response.use(response=>{
  NProgress.done();
  return response
})
//挂载到全局
Vue.prototype.$axios=axios;


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

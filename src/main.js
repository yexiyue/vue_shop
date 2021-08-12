import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/global.css'
import './plugin/element'

//引入axios
import axios from 'axios';
//设置根请求路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//挂载到全局
Vue.prototype.$axios=axios;


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

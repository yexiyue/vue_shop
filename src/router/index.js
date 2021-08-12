import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
Vue.use(VueRouter)

export default new VueRouter({
    routes:[
        //添加重定向
        {path:'/',redirect:'/login'},
        {path:'/login',component:Login}
    ]
})

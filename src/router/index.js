import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const router= new VueRouter({
    routes:[
        //添加重定向
        {path:'/',redirect:'/login'},
        {path:'/login',component:Login},
        {path:'/home',component:Home}
    ]
})

//设置路由导航守卫
router.beforeEach((to,from,next)=>{
    //登录拦截
    if(to.path=='/login')return next();
    const loginCredential=sessionStorage.getItem('LoginCredential');
    if(!loginCredential){
        return next('/login')
    }
    next()
})


export default router
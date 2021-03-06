import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import List from '../components/goods/List'
import AddGoods from '../components/goods/AddGoods'
import Order from '../components/order/Order'
import Report from '../components/report/Report'

Vue.use(VueRouter)

const router= new VueRouter({
    routes:[
        //添加重定向
        {path:'/',redirect:'/login'},
        {path:'/login',component:Login},
        {
            path:'/home',
            component:Home,
            redirect:'/home/welcome',
            children:[
                {path:'welcome',component:Welcome},
                {path:'users',component:User},
                {path:'rights',component:Rights},
                {path:'roles',component:Roles},
                {path:'categories',component:Cate},
                {path:'params',component:Params},
                {path:'goods',component:List},
                {path:'addGoods',component:AddGoods},
                {path:'orders',component:Order},
                {path:'reports',component:Report},
            ]
        }
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
});


export default router
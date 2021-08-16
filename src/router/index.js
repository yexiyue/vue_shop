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
import TreeTable from 'vue-table-with-tree-grid'
Vue.use(VueRouter)
Vue.component('tree-table',TreeTable)

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
<template>
<el-container class="home-container">
    <!-- 页面头部 -->
    <el-header>
        <div>
            <img src="../assets/后台管理.png" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button @click="logout" type="info" round>退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
            <div class="togger-button" @click="togger">|||</div>
            <el-menu background-color="#5961d4" text-color="#fff" 
            active-text-color="#ffd04b" unique-opened router :default-active="activePath"
            :collapse="isCollapse" :collapse-transition="false">
            <!-- 一级菜单 -->
            <el-submenu  v-for="i in menuList" :key="i.id" :index="i.id+''">
                <!-- 一级菜单模板区 -->
                <template slot="title">
                <i class="iconfont" :class="iconlist[i.id]"></i>
                <span>{{i.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item v-for="item in i.children" :key="item.id"
                :index="'/home/'+item.path" @click="saveNavState('/home/'+item.path)">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item.authName}}</span>
                </el-menu-item>
                <!-- 一级菜单模板区 -->
            </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 主体内容 -->
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    name:"Home",
    data() {
        return {
            menuList:[],
            iconlist:{
                125:'icon-yonghuguanli',
                103:'icon-quanxianguanli',
                101:'icon-shangpinguanli',
                102:'icon-dingdanguanli',
                145:'icon-shujutongji',
            },
            isCollapse:false,
            activePath:''
        }
    },
    methods:{
        //退出功能
        logout(){
            sessionStorage.clear();
            this.$router.push('/login')
        },
        //获取左侧菜单数据
        async getmenu(){
            //多重解构yyds
            const {data:{data,meta:{status,msg}}}=await this.$axios.get('/menus')
            if(status!=200)return this.$message.error(msg);
            this.menuList=data;
            //console.log(data)
        },
        //实现左侧导航切换
        togger(){
            this.isCollapse=!this.isCollapse;
        },
        //保存链接的激活状态
        saveNavState(activePath){
            //保存到本地以便下一次激活时取出
            sessionStorage.setItem('activePath',activePath);
            //实现切换
            this.activePath=activePath;
        }
    },
    created() {
        //在创建后调取列表信息
        this.getmenu();
        //刚激活时赋值 链接的激活状态
        this.activePath=sessionStorage.getItem('activePath');
    }
}
</script>

<style lang='less' scoped>
    .home-container{
        height:100vh;
    }
    .el-header{
        background: linear-gradient(90deg, #9ea9d3, #7fa3c5, rgba(96,168,182,1));
        display:flex;
        justify-content: space-between;
        padding-left:0;
        align-items: center;
        div{
            display:flex;
            align-items: center;
            font-size: 20px;
            color:rgba(255, 251, 251, 0.815);
            img{
                width:50px;
                height:50px;
            }
            span{
                height:100%;
                margin-left:15px;
            }
        }
        .el-button{
            background-color: #22DDDD;
            border:none;
            
        }
        .el-button:hover{
                background: linear-gradient(90deg, rgba(232, 237, 96, 1), rgba(255,144,168,1));
            }
        
    }
    .el-aside{
        background:#5961d4;
        .iconfont{
            margin-right:10px;
            font-size: 18px;
            color:rgba(255,255,255,0.7);
        }
        .el-menu{
            border-right:none;
        }
        .togger-button{
            background-color: #5961d4;
            font-size:10px;
            text-align: center;
            color:rgb(50, 221, 252);
            line-height:24px;
            letter-spacing:0.2em;
            cursor: pointer;
        }
        .togger-button:hover{
                background-color: #4852dada;
            }
    }
    .el-main{
        background-color: rgba(252, 248, 248, 0.938);
    }
</style>
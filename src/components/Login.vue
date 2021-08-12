<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区 -->
            <div class="avater_box">
                <img src="../assets/avater.png" alt="">
            </div>
            <!-- 登录表单区 -->
            <el-form class="login_form" :model="form" :rules="rules">
                <el-form-item prop="username">
                    <el-input v-model="form.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button class="btnitem" type="primary" plain round>登录</el-button>
                    <el-button class="btnitem" type="info" plain round>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name:'Login',
    data(){
        return {
            //表单数据
            form:{
                username:'',
                password:''
            },
            //表单验证规则对象
            rules:{
                username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
                password:[
                    
                ]
            }
        }
    },
    updated() {
        
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background: linear-gradient(90deg, rgba(193, 147, 222, 1), rgba(195, 70, 202, 1), #5a8dcc);
    height:100vh;
}

.login_box{
    width:450px;
    height:300px;
    background-color: rgba(0, 255, 242, 0.466);
    border-radius: 15px;
    position:absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);


    .avater_box{
        height: 130px;
        width:130px;
        border: 1px solid red;
        border-radius: 50%;
        position:absolute;
        overflow: hidden;
        left:50%;
        transform:translate(-50%,-40%);
        img{
            width:120%;
            height:120%;
            position: absolute;
            top:-20%;
            left:-10%;
        }
    }
}

.btn{
    display:flex;
    justify-content: space-around;
    .btnitem{
        margin:0 20px;
    }
}

.login_form{
    position:absolute;
    bottom:0;
    width:100%;
    padding:0 10%;
    box-sizing: border-box;
}
</style>
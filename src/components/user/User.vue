<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input placeholder="请输入内容"  class="input-with-select" @clear="getUserList" clearable v-model="queryInfo.query">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表数据展示 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template #default="scope">
                        <el-switch v-model="scope.row.mg_state" @change="checkStatus(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template #default="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyDialog(scope.row.id)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
                        <!-- 分配角色 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            
            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <!-- dialog会话框 -->
        <el-dialog
        title="添加用户" :append-to-body="true"
        :visible.sync="addDialogVisible" @close="clearAddForm"
        width="60%">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"  label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
        title="修改用户"
        :visible.sync="modifyDialogVisible" @close="clearModifyForm"
        width="60%">
            <!-- 表单主体区 -->
            <!-- 共用一套验证规则 -->
            <el-form :model="modifyForm" :rules="addFormRules" ref="modifyFormRef"  label-width="70px">
            <el-form-item label="用户名">
                <el-input v-model="modifyForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="modifyForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="modifyForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="modifyDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyUser()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'User',
    data() {
        //邮箱验证
        const checkEmail=(rule,value,callback)=>{
            const regEmail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(regEmail.test(value)){
                return callback()
            }else{
                return callback(new Error('邮箱不符合规则'))
            }
        }
        //手机号验证
        const checkMobile=(rule,value,callback)=>{
            const regMobile=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
            if(regMobile.test(value)){
                return callback()
            }else{
                return callback(new Error('手机号不符合规则'))
            }
        }



        return {
            queryInfo:{
                query:'',
                //当前的页数
                pagenum:1,
                //每页显示页数
                pagesize:2
            },
            userlist:[],
            //数据条数
            total:0,
            //控制会话框
            addDialogVisible:false,
            //添加对话框中的表单
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''

            },
            addFormRules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},
                    {min:3,max:10,message:'用户名长度在 3 到 10 之间' ,trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:3,max:10,message:'密码长度在 6 到 15 之间' ,trigger:'blur'}
                ],
                email:[
                    {required:true,message:'请输入邮箱',trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {required:true,message:'请输入手机号',trigger:'blur'},
                    {validator:checkMobile,trigger:'blur'}
                ]
            },
            //修改按钮对话框
            modifyDialogVisible:false,
            //修改对话框中的表单
            modifyForm:{
                email:'',
                mobile:'',
                username:''
            }
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        //发送请求获取数据
        async getUserList(){
            const {data:{data,meta:{msg,status}}}=await this.$axios.get('/users',{
                params:this.queryInfo
            });
            if(status!=200)return this.$message.error(msg);
            //console.log(data)
            this.total=data.total;
            this.userlist=data.users;
        },
        //修改用户状态
        async checkStatus(value){
           const {data:{meta:{msg,status}}}= await this.$axios.put(`/users/${value.id}/state/${value.mg_state}`);
           if(status!=200){
               value.mg_state=!value.mg_state;
               return this.$message.error(msg)
           }
           this.$message.success(msg)
        },
        //监听pagesize
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize;
            //重新请求数据
            this.getUserList();
        },
        //监听页码改变
        handleCurrentChange(newpage){
            this.queryInfo.pagenum=newpage;
            //重新请求数据
            this.getUserList();
        },
        //关闭对话框事件
        clearAddForm(){
            this.$refs.addFormRef.resetFields()
        },
        //表单预验证 添加用户
        addUser(){
            this.$refs.addFormRef.validate(async (isvalid)=>{
                if(!isvalid) return;
                
                
                //发送添加用户请求
                const {data:{meta:{msg,status}}}= await this.$axios.post('/users',this.addForm)
                if(status!=201) return this.$message.error(msg);
                this.$message.success(msg)
                //隐藏会话框
                this.addDialogVisible = false
                //重新请求数据解析模板
                this.getUserList();
            })
            
            
        },
        //修改按钮对话框
        async modifyDialog(id){
            //发送请求获取用户信息
            const {data:{data,meta:{msg,status}}}=await this.$axios.get(`/users/${id}`);
            if(status!=200)return this.$message.error(msg);
            //保存用户信息在data中 以便渲染模板
            this.modifyForm=data
            this.modifyDialogVisible=true;
            
        },
        //关闭对话框后重置表单
        clearModifyForm(){
            this.$refs.modifyFormRef.resetFields()
        },
        //修改用户数据
        modifyUser(){
            this.$refs.modifyFormRef.validate(async (isvalide)=>{
                if(!isvalide)return;
                //发送请求修改数据
                const {data:{meta:{msg,status}}}=await this.$axios.put(`/users/${this.modifyForm.id}`,{
                    email:this.modifyForm.email,
                    mobile:this.modifyForm.mobile
                });
                if(status!=200)return this.$message.error(msg);
                this.$message.success(msg);
                //修改成功后重新请求渲染模板
                this.getUserList();
                //关闭对话框
                this.modifyDialogVisible = false
            })
        },
        //删除用户数据
        async removeUser(id){
            try {
                //弹框提示是否删除用户
                await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                });
                //发送请求删除用户
                const {data:{meta:{msg,status}}}=await this.$axios.delete('/users/'+id)
                if(status!=200)return this.$message.error(msg)
                //重新请求数据渲染模板
                this.getUserList()
                //提示用户
                this.$message.success(msg)
            } catch (error) {
                //提示用户
                this.$message.info('已取消删除')
            }
            /* const confirmRes=  */
            /* console.log(confirmRes) */
            
        }
       
    },
}
</script>

<style lang="less" scope>
    .box-card {
        width: 100%;
        margin:0 auto;
    }
</style>
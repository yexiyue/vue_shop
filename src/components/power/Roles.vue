<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col><el-button type="primary" @click="roleDialogVisible = true">添加角色</el-button></el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table :data="rolesList" style="width: 100%" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template #default="scope">
                        <!-- 栅格系统 -->
                        <el-row :class="['db-bottom',index==0 ?'db-top':'','vcenter']" v-for="(item1,index) in scope.row.children" :key="item1.id">
                            <!-- 第一列渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="removeRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环渲染二级权限 -->
                                <el-row :class="[i2==0?'':'db-top','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag @close="removeRight(scope.row,item2.id)"  closable type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col >
                                    <!-- 通过for循环渲染三级权限 -->
                                    <el-col :span="18">
                                            <el-tag  @close="removeRight(scope.row,item3.id)" closable :class="[i3==0?'':'db-top']" v-for="(item3,i3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag> 
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="290px">
                    <template #default="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeRole(scope.row.id)">删错</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRights(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色会话框 -->
        <el-dialog
        title="添加角色"
        :visible.sync="roleDialogVisible" @close="clearAddRoleForm"
        width="60%">
        <!-- 主体区 -->
        <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sendAddRoleForm">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 添加编辑会话框 -->
        <el-dialog
        title="修改角色"
        :visible.sync="editRoleDialogVisible" @close="clearEditRoleForm"
        width="60%">
        <!-- 主体区 -->
        <el-form :model="editRoleForm" :rules="addRoleRules" ref="editRoleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sendEditRoleForm">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配权限会话框 -->
        <el-dialog
        title="分配权限" @close="clearDefKey"
        :visible.sync="setRightsDialogVisible"
        width="60%">
        <!-- 树形控件 -->
        <el-tree ref="treeRef" :data="rightList" :props="treeProps" default-expand-all
        show-checkbox node-key="id" :default-checked-keys="defKey"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allortRights">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:"Roles",
    data() {
        return {
            //角色列表
            rolesList:[],
            //添加角色会话框
            roleDialogVisible:false,
            addRoleForm:{
                roleName:'',
                roleDesc:''
            },
            addRoleRules:{
                roleName:[
                    {required:true,message:'请输入角色名称',trigger:'blur'},
                    {min:2,max:6,message:'角色名称长度在 2 到 6之间',trigger:'blur'}
                ],
                roleDesc:[
                    {required:true,message:'请输入角色描述',trigger:'blur'},
                    {min:2,max:8,message:'角色描述长度在 2 到 8之间',trigger:'blur'}
                ]
            },
            //编辑角色会话框
            editRoleDialogVisible:false,
            editRoleForm:{
                roleName:'',
                roleDesc:''
            },
            //设置权限会话框
            setRightsDialogVisible:false,
            //权限列表数据
            rightList:[],
            //树形控件绑定字段
            treeProps:{
                //数据属性
                childred:'children',
                //显示属性
                label:'authName'
            },
            //默认勾选的节点的 key 的数组
            defKey:[],
            //当前即将被分配权限的id
            roleId:''
        }
    },
    created() {
        this.getRolesData()
    },
    methods: {
        //发送请求获取角色列表数据
        async getRolesData(){
            const {data:{data,meta:{msg,status}}}=await this.$axios.get('/roles');
            if(status!=200)return this.$message.error(msg)
            this.rolesList=data
        },
        //关闭对话框清空表单
        clearAddRoleForm(){
            this.$refs.addRoleRef.resetFields()
        },
        //发送请求添加角色
        async sendAddRoleForm(){
            //进行预验证
            try {
                await this.$refs.addRoleRef.validate()
                //发送请求
                const {data:{meta:{msg,status}}}=await this.$axios.post('/roles',this.addRoleForm);
                if(status!=201)return this.$message.error(msg)
                this.$message.success(msg)
                //重新请求数据渲染列表
                this.getRolesData()
                //关闭对话框
                this.roleDialogVisible = false
            } catch (error) {
                return false
            }
            
            
            
        },
        //修改角色
        async editRole(id){
            //发送请求获取当前角色信息
            const {data:{data,meta:{msg,status}}}=await this.$axios.get(`/roles/${id}`)
            if(status!=200)return this.$message.error(msg)
            this.editRoleForm=data
            console.log(this.editRoleForm)
            //开启对话框
            this.editRoleDialogVisible=true

        },
        //关闭对话框清空表单
        clearEditRoleForm(){
            this.$refs.editRoleRef.resetFields()
        },
        //发送请求修改角色
        async sendEditRoleForm(){
            //进行预验证
            try{
                await this.$refs.editRoleRef.validate()
                //发送修改请求
                const {data:{meta:{msg,status}}}=await this.$axios.put(`/roles/${this.editRoleForm.roleId}`,{
                    roleName:this.editRoleForm.roleName,
                    roleDesc:this.editRoleForm.roleDesc
                })
                if(status!=200)return this.$message.error(msg);
                this.$message.success(msg);
                //重新请求数据渲染列表
                this.getRolesData()
                //关闭窗口
                this.editRoleDialogVisible = false
            }catch(err){
                return 
            }
        },
        //删除用户
        async removeRole(id){
            try {
                await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                });
                //发送请求删除角色
                const {data:{meta:{msg,status}}}=await this.$axios.delete(`/roles/${id}`)
                if(status!=200)return this.$message.error(msg)
                //发送请求重新渲染页面
                this.getRolesData()
                this.$message.success(msg)
            } catch (error) {
                return this.$message.info('已取消删除')
            }
        },
        //删除权限
        async removeRight(role,rightId){
            //弹框提示用户是否删除
            try {
                await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                });
                //发起请求删除指定权限
                const {data:{data,meta:{msg,status}}}=await this.$axios.delete(`/roles/${role.id}/rights/${rightId}`)
                if(status!=200)return this.$message.error(msg);
                //发送请求重新渲染页面会关闭扩展页面
                /*  this.getRolesData() */
                //重新为children赋值
                role.children=data
                this.$message.success(msg)
            } catch (error) {
                return this.$message.info('已取消删除')
            }
        },
        //分配权限
        async setRights(role){
            this.roleId=role.id
            const {data:{data,meta:{mes,status}}}=await this.$axios.get('/rights/tree');
            if(status!=200)return this.$message.error(msg)
            //获取到的权限数据保存到data中
            this.rightList=data
            //递归获取三级节点
            this.getLeafKeys(role,this.defKey)
            this.setRightsDialogVisible=true
        },
        //递归获取所有三级权限并保存到defKey
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>{
                this.getLeafKeys(item,arr)
            })
        },
        //关闭对话框清空defkey
        clearDefKey(){
            this.defKey=[]
        },
        //发送请求分配权限
        async allortRights(){
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ];
            const strId=keys.join(',');
            //发送请求
            const {data:{meta:{msg,status}}}=await this.$axios.post(`/roles/${this.roleId}/rights`,{rids:strId})
            if(status!=200)return this.$message.error(msg)
            this.$message.success(msg);
            //发送请求重新渲染页面
            this.getRolesData()
            this.setRightsDialogVisible = false
        }
    },
}
</script>

<style lang="less">
    .el-tag{
        margin:7px;
    }
    .db-top{
        border-top: 1px solid #a4e2c6;
    }
    .db-bottom{
        border-bottom: 1px solid #a4e2c6;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>
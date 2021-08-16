<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 头部警告 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning" :closable="false"
                show-icon>
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="row_top">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 级联选择器区域 -->
                    <el-cascader
                    v-model="selectdKeys" popper-class="cascaderBox"
                    :options="cateList" :clearable="true"
                    :props="cascaderProps" 
                    @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addParams">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table
                    :data="manyTableData" border style="width: 100%">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template #default="scope">
                                <!-- 循环tag标签 -->
                                <el-tag @close="handleClose(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input
                                class="input-new-tag inputl-ength"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small" 
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#" stripe >
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称" stripe >
                        </el-table-column>
                        <el-table-column label="操作" stripe >
                            <template #default="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addParams">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table
                    :data="onlyTableData" border style="width: 100%">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template #default="scope">
                                <!-- 循环渲染 -->
                                <el-tag @close="handleClose(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input
                                class="input-new-tag inputl-ength"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#" stripe >
                        </el-table-column>
                        <el-table-column prop="attr_name" label="属性名称" stripe >
                        </el-table-column>
                        <el-table-column label="操作" stripe >
                            <template #default="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"  @click="editParams(scope.row)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 添加对话框 -->
            <el-dialog
            :title="'添加'+TextName" @close="clearAddParamsForm"
            :visible.sync="addParamsDialogVisible"
            width="60%">
            <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="100px" >
                <el-form-item :label="TextName" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendAddParams">确 定</el-button>
            </span>
            </el-dialog>

            <!-- 编辑对话框 -->
            <el-dialog
            :title="'编辑'+TextName" @close="clearEditParamsForm"
            :visible.sync="editParamsDialogVisible"
            width="60%">
            <el-form :model="editParamsForm" :rules="addParamsRules" ref="editParamsRef" label-width="100px" >
                <el-form-item :label="TextName" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendEditParams">确 定</el-button>
            </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'Params',
    data() {
        return {
            //商品数据列表
            cateList:[],
            //选中的值
            selectdKeys:[],
            //级联选择器配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:'hover'
            },
            //被激活的页签名称
            activeName:'many',
            manyTableData:[],
            onlyTableData:[],
            //添加对话框
            addParamsDialogVisible:false,
            addParamsForm:{
                attr_name:''
            },
            addParamsRules:{
                attr_name:[
                    {required:true,message:'请输入名称',trigger:'blur'}
                ]
            },
            //修改对话框
            editParamsDialogVisible:false,
            editParamsForm:{},

        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        //获取商品分类数据列表
        async getCateList(){
            const {data:{data,meta:{msg,status}}}=await this.$axios.get('/categories')
            if(status!=200)return this.$message.error(msg);
            this.cateList=data
        },
        //获取参数列表
        async getParamsData(){
            if(this.selectdKeys.length<3){
                this.selectdKeys=[];
                this.manyTableData=[]
                this.onlyTableData=[]
                return
            }
            //发送请求获取对应参数
            const {data:{data,meta:{msg,status}}}=await this.$axios.get(`/categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(status!=200)return this.$message.error(msg)
            data.forEach(item=>{
                item.attr_vals=item.attr_vals ?item.attr_vals.split(' '):[];
                 //控制按钮与文本框切换显示
                item.inputVisible=false
                //文本框输入的值
                item.inputValue=''
            })
            if(this.activeName=='many'){
                this.manyTableData=data
            }else{
                this.onlyTableData=data
            }
        },
        //选择器值改变时
        handleChange(){
            //发送请求获取参数列表数据
            this.getParamsData()
        },
        //点击tab页签时触发
        handleTabClick(){
            //发送请求获取参数列表数据
            this.getParamsData()
        },
        //添加对话框
        addParams(){
            this.addParamsDialogVisible=true;
        },
        //关闭对话框清除数据
        clearAddParamsForm(){
            this.$refs.addParamsRef.resetFields()
            this.addParamsForm={}
        },
        //发送表单
        async sendAddParams(){
            try {
                await this.$refs.addParamsRef.validate()
                //验证通过发送请求
                const {data:{meta:{status,msg}}}=await this.$axios.post(`/categories/${this.cateId}/attributes`,{
                    attr_name:this.addParamsForm.attr_name,
                    attr_sel:this.activeName,
                });
                if(status!=201)return this.$message.error(msg)
                this.$message.success(msg)
                //重新获取参数列表数据
                this.getParamsData()
                this.addParamsDialogVisible=false
            } catch (error) {
                return
            }
        },
        //编辑对话框
        async editParams(value){
            this.editParamsDialogVisible=true;
            //请求改数据填入表单
            const {data:{data,meta:{msg,status}}}=await this.$axios.get(`categories/${this.cateId}/attributes/${value.attr_id}`,{
                params:{attr_sel:this.activeName}
            });
            if(status!=200)return this.$message.error(msg)
            this.editParamsForm=data
        },
        //关闭清空数据
        clearEditParamsForm(){
            this.$refs.editParamsRef.resetFields()
            this.editParamsForm={}
        },
        //发送表单
        async sendEditParams(){
            try {
                await this.$refs.editParamsRef.validate();
                const {data:{meta:{msg,status}}}=await this.$axios.put(`/categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,{
                    attr_sel:this.activeName,
                    attr_name:this.editParamsForm.attr_name
                })
                if(status!=200)return this.$message.error(msg)
                this.$message.success(msg)
                //重新获取参数列表数据
                this.getParamsData()
                this.editParamsDialogVisible=false
            } catch (error) {
                return false
            }
        },
        //删除功能
        async deleteParams(value){
            try{
                await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                const {data:{meta:{msg,status}}}=await this.$axios.delete(`/categories/${this.cateId}/attributes/${value.attr_id}`)
                if(status!=200)return this.$message.error(msg)
                this.$message.success(msg)
                //重新获取参数列表数据
                this.getParamsData()
            }catch(er){
                this.$message.info('已取消删除')
            }
        },
        //添加按钮点击切换文本框
        showInput(value){
            value.inputVisible=true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //文本框触发事件
        async handleInputConfirm(value){
            if(value.inputValue.trim().length==0){
                value.inputValue='';
                value.inputVisible=false;
                return
            }
            value.attr_vals.push(value.inputValue.trim())
            value.inputValue=''
            //发送请求到服务器
            this.saveTagValue(value)
            value.inputVisible=false;
        },
        //保存数据到服务器
        async saveTagValue(value){
                const {data:{meta:{status,msg}}}=await this.$axios.put(`categories/${this.cateId}/attributes/${value.attr_id}`,{
                attr_name:value.attr_name,
                attr_sel:this.activeName,
                attr_vals:value.attr_vals.join(' ')
            })
            if(status!=200)return this.$message.error(msg)
            this.$message.success(msg)
        },
        //监听tag关闭事件
        handleClose(i,value){
            value.attr_vals.splice(i,1)
            //发送请求到服务器
            this.saveTagValue(value)
        }
    },
    computed:{
        //是否禁用按钮
        isBtnDisabled(){
            if(this.selectdKeys.length!=3)return true;
            return false;
        },
        //级联器选择的三级id
        cateId(){
            if(this.selectdKeys.length==3){
                return this.selectdKeys[2];
            }
            return null
        },
        TextName(){
            return this.activeName=='many'?'动态参数':'静态属性'
        }
    }
}
</script>

<style lang="less">
    .row_top{
        margin:15px 0;
    }
    .cascaderBox{
        height:300px;
        overflow: auto;
    }
    .el-cascader{
        width:40%;
    }
    .el-tag{
        margin:5px;
    }
    .inputl-ength{
        width:180px !important;
    }
</style>
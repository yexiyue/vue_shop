<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table class="treeTable" :data="categoriesList" :columns="columns" 
            :selection-type="false" :expand-type="false" 
            show-index index-text="#"  border>
            <!--  有效模板列 -->
            <template slot="isOK" scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:lightgreen;font-size:18px;" ></i>
                <i class="el-icon-error" style="color:red;font-size:18px;" v-else></i>
            </template>
            <!-- 等级模板列 -->
            <template slot="level" scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
                <el-tag size="mini" type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
                <el-tag size="mini" type="warning" v-else>三级</el-tag>
            </template>
            <!-- 操作模板列 -->
            <template slot="opt" scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
            </template>
            </tree-table>

             
            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
        title="添加分类" @close="clearAddCateForm"
        :visible.sync="addCateDialogVisible"
        width="60%">
        <!-- 表单区域 -->
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
                <!-- 级联选择器 -->
                <el-cascader v-model="selectdKeys" :options="parentCateList" :props="cascaderProps" popper-class="cascaderBox"
                :clearable="true" @change="parendCateChange"></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑分类对话框 -->
        <el-dialog
        title="编辑分类" 
        :visible.sync="editCateDialogVisible"
        width="60%">
        <el-form :model="editCateForm" :rules="addCateRules" ref="editCateFormRef" label-width="100px">
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sendEditForm">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name:'Cate',
    data() {
        return {
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //商品分类数据列表
            categoriesList:[],
            total:0,
            columns:[
                {label:'分类名称',prop:'cat_name'},
                {label:'是否有效',type:'template',template:'isOK'},
                {label:'排序',type:'template',template:'level'},
                {label:'操作',type:'template',template:'opt',minWidth:'100px'}
            ],

            //添加对话框
            addCateDialogVisible:false,
            addCateForm:{
                cat_name:'',
                cat_level:0,
                cat_pid:0,
            },
            addCateRules:{
                cat_name:[
                    {required:true,message:'请输入分类名',trigger:'blur'},
                    {min:2,max:6,message:'名称长度在 2 到 6之间',trigger:'blur'}
                ]
            },
            //父级分类列表
            parentCateList:[],
            //级联选择器配置对象
            cascaderProps:{
                expandTrigger:'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children',
                checkStrictly:true,
            },
            //选中的值
            selectdKeys:[],

            //编辑分类对话框
            editCateDialogVisible:false,
            //编辑分类表单数据
            editCateForm:{},

        }
    },
    created() {
        this.getCategoriesList()
    },
    methods: {
        //获取商品分类数据列表
        async getCategoriesList(){
            const {data:{data,meta:{status,msg}}}=await this.$axios.get('/categories',{params:this.queryInfo});
            if(status!=200)return this.$message.error(msg);
            this.categoriesList=data.result
            this.total=data.total
        },
        //页码大小改变触发此事件
        handleSizeChange(newPageSize){
            this.queryInfo.pagesize=newPageSize;
            this.getCategoriesList()
        },
        //页码值改变触发
        handleCurrentChange(newPageNum){
            this.queryInfo.pagenum=newPageNum;
            this.getCategoriesList()
        },
        //点击打开对话框
        showCateDialog(){
            this.addCateDialogVisible=true
            this.getParentCateList()
        },
        //获取父级分类列表
        async getParentCateList(){
            const {data:{data,meta:{msg,status}}}=await this.$axios.get('categories',{params:{type:2}});
            if(status!=200)return this.$message.error(msg);
            this.parentCateList=data
        },
        //选项改变时触发
        parendCateChange(){
            //如果选择器选中了
            if(this.selectdKeys.length>0){
                this.addCateForm.cat_pid=this.selectdKeys[this.selectdKeys.length-1];
                //为等级赋值
                this.addCateForm.cat_level=this.selectdKeys.length;
                return
            }else{
                this.addCateForm.cat_pid=0
                //为等级赋值
                this.cat_level=0
            }
            
        },
        //点击确认发送表单
        async addCate(){
            //进行预验证
            try {
                await this.$refs.addCateFormRef.validate()
                //发送请求
                const {data:{meta:{msg,status}}}=await this.$axios.post('/categories',this.addCateForm);
                if(status!=201)return this.$message.error(msg);
                this.$message.success(msg)
                //重新获取数据刷新列表
                this.getCategoriesList()
                this.addCateDialogVisible=false;
            } catch (error) {
                return false
            }


            
           
        },
        //关闭重置表单
        clearAddCateForm(){
            this.$refs.addCateFormRef.resetFields()
            this.selectdKeys=[]
            this.addCateForm.cat_level=0;
            this.addCateForm.cat_pid=0;
        },
        //编辑分类
        async editCate(value){
            this.editCateDialogVisible=true;
            //发送请求获取当前数据
            const {data:{data,meta:{msg,status}}}=await this.$axios.get('/categories/'+value.cat_id)
            if(status!=200)return this.$message.error(msg)
            this.editCateForm=data;

        },
        //点击确定发送请求
        async sendEditForm(){

            try {
                await this.$refs.editCateFormRef.validate()
                const {data:{data,meta:{msg,status}}}=await this.$axios.put('/categories/'+this.editCateForm.cat_id,{
                    cat_name:this.editCateForm.cat_name
                })
                if(status!=200)return this.$message.error(msg)
                this.$message.success(msg)
                //刷新页面
                this.getCategoriesList()
                //关闭会话框
                this.editCateDialogVisible = false;
            } catch (error) {
                return false
            }
        },
        

        //删除分类
        async deleteCate(value){
            try {
                await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                });
                const {data:{meta:{msg,status}}}=await this.$axios.delete(`categories/${value.cat_id}`);
                if(status!=200)return this.$message.error(msg)
                this.$message.success(msg)
                //刷新页面
                this.getCategoriesList()
            } catch (error) {
                return this.$message.info('已取消删除')
            }

        }
    },
}
</script>

<style lang="less">
    .treeTable{
        margin-top:15px;
    }
    .cascaderBox{
        height:300px;
        overflow: auto;
    }
    .el-cascader{
        width:40%;
    }
</style>
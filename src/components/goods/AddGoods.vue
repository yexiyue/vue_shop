<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert
                title="添加商品信息"
                type="info"
                center
                :closable="false"
                show-icon>
            </el-alert>

            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
           

            <!-- tab栏区域 -->
            <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                            v-model="addGoodsForm.goods_cat"
                            :options="cateList" clearable popper-class="cascaderBox"
                            :props="cascaderProps"
                            @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染商品参数-->
                        <el-form-item v-for="i in manyTableData" :key="i.attr_id" :label="i.attr_name">
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="i.attr_vals">
                                <el-checkbox border size="small" :key="i" v-for="(item,i) in i.attr_vals" :label="item"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!-- 渲染商品属性-->
                        <el-form-item v-for="i in onlyTableData" :key="i.attr_id" :label="i.attr_name">
                            <el-input v-model="i.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 上传功能 -->
                        <el-upload
                        action="http://127.0.0.1:8888/api/private/v1/upload"
                        :on-preview="handlePreview" :on-success="handleSuccess"
                        :on-remove="handleRemove" :headers="headersObj"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button style="margin-top:15px;" type="primary" @click="sendAddGoodsForm">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>


            <!-- 图片预览对话框 -->
            <el-dialog title="图片预览"
            :visible.sync="previewDialogVisible" width="60%">
            <img :src="previewPath" alt="">
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
//导入lodash
import _ from 'lodash'

export default {
    name:'AddGoods',
    data() {
        return {
            activeIndex:'0',
            //添加商品表单
            addGoodsForm:{
                goods_name:'',
                goods_price:0,
                goods_number:0,
                goods_weight:0,
                goods_cat:[],
                goods_introduce:'',
                pics:[],
                attrs:[],

            },
            //表单验证规则
            addGoodsRules:{
                goods_name:[
                    {required:true,message:'请输入商品名称',trigger:'blur'}
                ],
                goods_price:[
                    {required:true,message:'请输入商品价格',trigger:'blur'}
                ],
                goods_number:[
                    {required:true,message:'请输入商品数量',trigger:'blur'}
                ],
                goods_weight:[
                    {required:true,message:'请输入商品重量',trigger:'blur'}
                ],
                goods_cat:[
                    {required:true,message:'请选择商品分类',trigger:'blur'}
                ]
            },
            //分类数据
            cateList:[],
            cascaderProps:{
                expandTrigger: 'hover',
                label:'cat_name',
                children:'children',
                value:'cat_id',
            },
            //分类参数数据列表
            manyTableData:[],
            onlyTableData:[],
            //图片上传请求头配置
            headersObj:{
                Authorization:sessionStorage.getItem('LoginCredential')
            },
            previewPath:'',
            //图片预览对话框
            previewDialogVisible:false
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        //获取分类列表数据
        async getCateList(){
            const {data:{data,meta:{msg,status}}}=await this.$axios.get('/categories')
            if(status!=200)return this.$message.error(msg)
            this.cateList=data
        },
        //选择器改变时触发
        handleChange(){
            if(this.addGoodsForm.goods_cat.length!=3){
                this.addGoodsForm.goods_cat=[]
            }
        },
        //标签页将要发生切换时触发
        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName=='0' && this.addGoodsForm.goods_cat.length!=3){
                this.$message.error('请先选择商品分类！')
                return false
            }
        },
        //tab被选中时
        async tabClicked(){
            if(this.activeIndex==1){
                const {data:{meta:{msg,status},data}}=await this.$axios.get(`/categories/${this.cateId}/attributes`,{
                    params:{sel:'many',}})
                if(status!=200)return this.$message.error(msg)
                this.manyTableData=data
                //进行数据处理
                this.manyTableData.forEach(item=>{
                    item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
                })
            }else if(this.activeIndex==2){
                const {data:{meta:{msg,status},data}}=await this.$axios.get(`/categories/${this.cateId}/attributes`,{
                    params:{sel:'only',}})
                if(status!=200)return this.$message.error(msg)
                this.onlyTableData=data
            }
        },
        //处理图片预览效果
        handlePreview(file){
            this.previewPath=file.response.data.url;
            this.previewDialogVisible=true
        },
        //处理图片移除
        handleRemove(file){
            //获取将要删除的临时路径
            const path=file.response.data.tmp_path;
            //从pics中找到该路径索引值
            const i =this.addGoodsForm.pics.findIndex(item=>{
                item.pic==path
            })
            //根据索引值删除
            this.addGoodsForm.pics.splice(i,1)
            //console.log(this.addGoodsForm)
        },
        //处理图片上传成功时
        handleSuccess(response){
            if(response.meta.status!=200)return this.$message.error(response.meta.msg)
            this.addGoodsForm.pics.push({pic:response.data.tmp_path})
            //console.log(this.addGoodsForm)
        },
        //把表单请求到服务器
        async sendAddGoodsForm(){
            //进行预校验
                this.$refs.addGoodsFormRef.validate(async isValid=>{
                    if(isValid){
                        //与级联选择器发生冲突
                        //this.addGoodsForm.goods_cat=this.addGoodsForm.goods_cat.join(',');
                        //用深拷贝解决
                        let deep=_.cloneDeep(this.addGoodsForm)
                        deep.goods_cat=deep.goods_cat.join(',');
                        //处理动态参数
                        this.manyTableData.forEach(item=>{
                            this.addGoodsForm.attrs.push({attr_id:item.attr_id,attr_vals:item.attr_vals.join(' ')})
                        })
                        //处理静态属性
                        this.onlyTableData.forEach(item=>{
                            this.addGoodsForm.attrs.push({attr_id:item.attr_id,attr_vals:item.attr_vals})
                        })
                        deep.attrs=this.addGoodsForm.attrs;
                        //console.log(deep)
                        //发起请求
                        const {data:{meta:{msg,status}}}=await this.$axios.post('/goods',deep)
                        console.log(status);
                        if(status!=201){
                            return this.$message.error(msg);
                        }
                        //重定向回商品列表页面
                        this.$router.push('/home/goods')
                        /* console.log(data) */
                        //this.$message.success(msg)
                    }else{
                        return this.$message.error('请填写必要的表单项！')
                    }
                })
                
                
            
        }

    },
    computed:{
        cateId(){
            if(this.addGoodsForm.goods_cat.length!=3){
                return null
            }
            return this.addGoodsForm.goods_cat[2]
        }
    }
}
</script>

<style lang="less">
    .cascaderBox{
        height:300px;
        overflow: auto;
    }
    .el-cascader{
        width:40%;
    }
    .el-checkbox{
        margin: 0 10px 0 0 !important;
    }
    .el-dialog{
        img{
            width:100%;
        }
    }
</style>
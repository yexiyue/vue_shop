<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <el-row>
                <el-col :span="12">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" >
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            
            <!-- table表格区 -->
             <el-table :data="orderList" border stripe>
                 <el-table-column type="index" label="#"></el-table-column>
                 <el-table-column prop="order_number" label="订单编号"></el-table-column>
                 <el-table-column prop="order_price" label="订单价格" width="120"></el-table-column>
                 <el-table-column label="是否付款" width="120">
                     <template #default="scope">
                         <el-tag  type="danger" v-if="scope.row.pay_status==0">未付款</el-tag>
                         <el-tag  type="success" v-else>已付款</el-tag>
                     </template>
                 </el-table-column>
                 <el-table-column prop="is_send" label="是否发放" width="95"></el-table-column>
                 <el-table-column prop="create_time" label="下单时间" width="180"></el-table-column>
                 <el-table-column  label="操作" width="150">
                     <template>
                         <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
                         <el-button type="success" size="mini" icon="el-icon-location" @click="showProgress"></el-button>
                     </template>
                 </el-table-column>
             </el-table>

            <!-- 底部分页区 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[ 3, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog
        title="修改地址" @close="clearAddressForm"
        :visible.sync="showBoxDialogVisible"
        width="60%">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader
                v-model="addressForm.address1"
                :options="cityData"
                :props="addressProps" popper-class="cascaderBox"
                @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showBoxDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="showBoxDialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>

                <!-- 展示物流的对话框 -->
        <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="60%">
        <el-timeline :reverse="true">
            <el-timeline-item type="success"
            v-for="(activity, index) in progressList"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
        </el-dialog>

    </div>
</template>

<script>
import cityData from './citydata'
export default {
    name:'Order',
    data() {
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5,

            },
            orderList:[],
            total:0,
            //修改地址对话框
            showBoxDialogVisible:false,
            //地址表单
            addressForm:{
                address1:[],
                address2:''
            },
            addressFormRules:{
                address1:[
                    {required:true,trigger:'blur',message:'请选择省市区/县'}
                ],
                address2:[
                    {required:true,trigger:'blur',message:'请输入详细地址'}
                ]
            },
            //级联选择器
            cityData,
            addressProps:{
                expandTrigger: 'hover',
                lable:'value',
                childred:'children'
            },
            progressDialogVisible:false,
            //保存展示物流数据
            progressList:[]
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        //请求订单列表
        async getOrderList(){
            const {data:{data,meta:{msg,status}}}=await this.$axios.get('/orders',{params:this.queryInfo});
            if(status!=200)return this.$message.error(msg)
            this.orderList=data.goods
            this.total=data.total
            this.orderList.forEach(item => {
                const dt=new Date(item.create_time)
                const y=dt.getFullYear()
                const m=(dt.getMonth()+1+'').padStart(2,'0')
                const date=(dt.getDate()+'').padStart(2,'0')
                const hh=(dt.getHours()+'').padStart(2,'0')
                const mm=(dt.getMinutes()+'').padStart(2,'')
                const ss=(dt.getSeconds()+'').padStart(2,'0')
                item.create_time=`${y}-${m}-${date} ${hh}:${mm}:${ss}`
            });
        },
        //监听页码大小
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            //重新请求数据刷新页面
            this.getOrderList()
        },
        //监听页码改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
            //重新请求数据刷新页面
            this.getOrderList()
        },
        // 展示修改地址的对话框
        showBox(){
            this.showBoxDialogVisible=true
        },
        //级联选择器改变时触发
        handleChange(){
            console.log(this.addressForm.address1)
        },
        //关闭对话框清除表单
        clearAddressForm(){
            this.$refs.addressFormRef.resetFields()
            this.addressForm.address1=[]
            this.addressForm.address2=''
        },
        //点击展示物流信息
        async showProgress(){
            const {data:{data,meta:{status,msg}}}=await this.$axios.get('/kuaidi/1106975712662')
            if(status!=200)return this.$message.error(msg)
            this.progressList=data
            this.progressDialogVisible=true
        }
    },
}
</script>

<style lang="less">
    .iconfont{
        font-size:12px;
    }
    .el-cascader{
        width:100%;
    }
</style>
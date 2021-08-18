<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input clearable @clear="getGoodsList()" placeholder="请输入内容" v-model="queryinfo.query">
                        <template #append>
                        <el-button icon="el-icon-search" @click="getGoodsList()"></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGoodsRouter">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- table表格区 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="95"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="150"></el-table-column>
                <el-table-column label="操作"  width="130">
                    <template #default="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button size="mini" type="danger" @click="deleteGoods(scope.row)" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 底部分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryinfo.pagenum" background
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryinfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
export default {
    name: "List",
    data() {
        return {
            queryinfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            //商品数据列表
            goodsList:[]
        };
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        //获取商品数据列表
        async getGoodsList(){
            const {data:{data,meta:{msg,status}}}=await this.$axios.get('/goods',{params:this.queryinfo})
            if(status!=200)return this.$message.error(msg)
            this.goodsList=data.goods;
            //处理时间
            this.goodsList.forEach(item => {
                let dt=new Date(item.add_time);
                let y=dt.getFullYear();
                let m=(dt.getMonth()+1+'').padStart(2,'0');
                let d=(dt.getDate()+'').padStart(2,'0');
                let hh=(dt.getHours()+'').padStart(2,'0')
                let mm=(dt.getMinutes()+'').padStart(2,'0')
                item.add_time=y+'-'+m+'-'+d+' '+hh+'-'+mm;
            });
            this.total=data.total
            
        },
            //监听页码大小改变
        handleSizeChange(newValue){
            this.queryinfo.pagesize=newValue
            console.log(newValue)
            //重新请求数据刷新页面
            this.getGoodsList()
        },
        //监听页码值改变
        handleCurrentChange(newValue){
            this.queryinfo.pagenum=newValue
            //重新请求数据刷新页面
            this.getGoodsList()
        },
        //删除商品
        async deleteGoods(row){
            try {
                await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                const {data:{meta:{msg,status}}}=await this.$axios.delete(`goods/${row.goods_id}`);
                if(status!=200)return this.$message.error(msg)
                this.$message.success(msg)
                this.getGoodsList()
            } catch (error) {
                this.$message.info('已经取消删除')
            }
        },
        //转到添加商品路由
        addGoodsRouter(){
            this.$router.push({
                path:'/home/addGoods',
            })
        }
    },
        
    };
</script>

<style lang="less">

</style>
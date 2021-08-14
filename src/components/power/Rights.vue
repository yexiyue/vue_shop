<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 表格渲染列表 -->
            <el-table :data="rightsList" style="width:100%" stripe border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template #default="scope">
                        <el-tag v-if="scope.row.level=='0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level=='1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'Rights',
    data() {
        return {
            rightsList:[],
            type:'list'
        }
    },
    created() {
        this.getRightsData()
    },
    methods: {
        //发送请求获取权限列表数据
        async getRightsData(){
            const {data:{data,meta:{msg,status}}}=await this.$axios.get(`/rights/${this.type}`);
            if(status!=200)return this.$message.error(msg);
            this.rightsList=data;
            
        }
    },
}
</script>

<template>
    <div>
        <h3>Welcome</h3>
        <el-alert
            :title="caohua"
            type="success"
            :closable="false">
        </el-alert>
    </div>
</template>

<script>
export default {
    name:'Welcome',
    data() {
        return {
            caohua:'',
        }
    },
    async created() {
        const saohua=this.$axios.create({
            baseURL:'https://api.uixsj.cn/hitokoto'
        })
        const data=await saohua.get('get?type=social')
        this.caohua=data.data
    },
    
}
</script>

<style lang="less">

</style>
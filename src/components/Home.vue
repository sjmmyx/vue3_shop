<template>
    HOME页面
    <el-button type="info" @click="logout">退出登录</el-button>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        // 退出登录事件
        logout(){
            // 1.清除本地token
            window.sessionStorage.clear()
            // 2.跳转到登录页面
            this.$router.push('/login')
        }
    }
}
</script>

<style>

</style>
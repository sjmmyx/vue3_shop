<template>
  <div class="login_container">
    <div class="login_box">
        <!-- 头像框Box -->
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 登录表单 -->
        <el-form ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form" :model="loginForm">
            <!-- 账号输入框 -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="el-icon-edit"></el-input>
            </el-form-item>
            <!-- 密码输入框 -->
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
            </el-form-item>
            <!-- 按钮组件 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetForm">重置</el-button>
            </el-form-item>

        </el-form>
    </div>
  </div>
</template>

<script>
// 引入 axios 库
import axios from "axios";

export default {
    data(){
        return{
            // 登录表单数据绑定对象
            loginForm:{
                username:"admin",
                password:"123456",
            },
            // 表单验证方法 输入框添加prop
            loginFormRules:{
                // 校验用户名
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                // 校验密码
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 重置表单数据
        resetForm() {
            this.$refs["loginFormRef"].resetFields();
        },
        login() {
            // 1.表单发送前验证
            this.$refs["loginFormRef"].validate(async (valid) => {
                // 2.验证成功后执行
                if (!valid) return;
                const api = "http://192.168.3.228:8888/api/private/v1/login";
                const { data: res } = await axios.post(api, this.loginForm);
                // 登录失败 返回错误信息
                // if (res.meta.status !== 200) return this.$message.error("登录失败："+res.meta.msg,{center:true})
                if (res.meta.status !== 200)
                return this.$message({
                    message: "登录失败：" + res.meta.msg,
                    center: true,
                    type: "error",
                });
                // 登录成功继续执行
                this.$message({
                message: "登录成功，跳转首页",
                type: "success",
                center: true,
                });
                // 1.将登录成功后token保存到客户端sessionStorage中
                const token = res.data.token;
                window.sessionStorage.setItem("token", token);
                //   1.1 项目中除了登录以外接口访问请求必须带上token
                //   1.2 token只在网站打开期间生效,所以保存再sessionStorage中
                // 2.通过VUE跳转到主页  路由地址/home
                this.$router.push("/home");
            });
            },
    }
};
</script>

<style>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}

.login_box{
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
}

.avatar_box img{
    height: 130px;
    width: 130px;
    border-radius: 50%;
    background-color: #eee;
}

.btns{
    /* display: flex;
    justify-content: flex-end; */
    /* right: 0%; */
    /* position: absolute; */
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
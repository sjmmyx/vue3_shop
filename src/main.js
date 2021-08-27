import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'
// 导入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

// 配置 axios 请求根路径
axios.defaults.baseURL = 'http://192.168.3.228:8888/api/private/v1/'
// axios 请求拦截器
axios.interceptors.request.use(config=>{
    // 添加token到请求头
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

const app =createApp(App)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$axios = axios // 自定义添加 挂载axios => $axios
app.mount('#app')

// 导入 Vue 核心库和应用组件
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 创建 Vue 应用实例
const app = createApp(App)

// 安装路由插件
app.use(router)

// 挂载应用到 DOM
app.mount('#app')

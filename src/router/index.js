// 导入 Vue Router 及主页组件
import { createRouter, createWebHistory } from 'vue-router'
import RealHomeView from '../views/RealHomeView.vue'

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RealHomeView // 主页：项目介绍、特色功能、团队成员等
    },
    {
      path: '/track',
      name: 'track',
      component: () => import('../views/TrackView.vue') // 永不失联：QQ群组列表
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue') // 联系我们：表单提交
    },
    {
      path: '/studywire',
      name: 'studywire',
      component: () => import('../views/StudyWireView.vue') // 留学前线：每日留学移民动态
    },
    {
      path: '/weekly_update',
      name: 'weekly_update',
      component: () => import('../views/WeeklyUpdateView.vue') // 润学周报：每周精选资讯
    }
    ,{
      path: '/support',
      name: 'support',
      component: () => import('../views/SupportView.vue') // 赞助与服务：赞助、鸣谢与付费服务
    }
  ]
})

export default router

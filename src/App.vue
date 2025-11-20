<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <div class="banner">
      <div class="brand">
        <div class="brand-text">润物有声</div>
        <!-- 主导航菜单 -->
        <nav class="nav">
          <router-link to="/" class="nav-item">主页</router-link>
          <router-link to="/track" class="nav-item">永不失联</router-link>
          <router-link to="/weekly_update" class="nav-item">润学周报</router-link>
          <router-link to="/studywire" class="nav-item">留学前线</router-link>
          <router-link to="/support" class="nav-item">赞助与服务</router-link>
          <router-link to="/contact" class="nav-item">联系我们</router-link>
        </nav>
      </div>
    </div>

    <!-- 主内容区域，带页面切换动画 -->
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 页脚 -->
    <footer>
      <p>&copy; 2025 润物有声项目 | 新生代海外华人互助社群</p>
    </footer>
  </div>
</template>

<style>
@import './assets/css/common.css';

/* 页面切换动画 - 统一使用流畅的缓动曲线 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

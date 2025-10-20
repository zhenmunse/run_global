<template>
  <div id="app">
    <div class="banner">
      <div class="brand">
        <div class="brand-text">润物有声</div>
        <nav class="nav">
          <router-link to="/" class="nav-item">主页</router-link>
          <router-link to="/weekly_update" class="nav-item">润学周报</router-link>
          <router-link to="/studywire" class="nav-item">留学前线</router-link>
          <router-link to="/about" class="nav-item">关于</router-link>
        </nav>
      </div>
    </div>

    <div class="container">
      <router-view/>
    </div>

    <footer>
      <p>&copy; 2025 润物有声项目 | 新生代海外华人互助社群</p>
    </footer>
  </div>
</template>

<style>
@import './assets/css/common.css';
</style>

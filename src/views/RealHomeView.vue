<template>
  <div class="home-wrapper">
    <!-- Side Navigation -->
    <nav class="side-nav" :class="{ visible: showNav }">
      <div class="nav-indicator" :style="{ top: indicatorTop + 'px' }"></div>
      <a 
        v-for="item in navItems" 
        :key="item.id"
        :href="`#${item.id}`"
        class="nav-link"
        :class="{ active: activeSection === item.id }"
        @click.prevent="scrollToSection(item.id)"
      >
        {{ item.label }}
      </a>
    </nav>

    <div class="home-container">
      <!-- Hero Section -->
      <section id="hero" class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">润物有声</h1>
          <p class="hero-subtitle">新生代海外华人互助社群</p>
          <div class="hero-description">
            <p>在信息传播日益重要的今天，我们深知信息差的打破对普通家庭意味着什么，但传统的 Reddit 等网站存在获取成本较高、信息密度低、滞后性等问题。</p>
            <p>因此，我们开发了一款"永不失联"的社群平台，大家可以通过本平台加入群聊，以获得最新的留学、移民相关动态，与世界各地的群友分享各个国家的经验、感悟与实用信息。</p>
            <p>我们相信，通过团队与广大群友的努力，可以共同打造出最大、最活跃的新生代海外华人互助社群。</p>
          </div>
        </div>
      </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <h2 class="section-title">💡 我们的特色</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🔗</div>
          <h3 class="feature-title">永不失联</h3>
          <p class="feature-description">
            多渠道QQ群备份，确保你随时能找到组织
          </p>
          <router-link to="/track" class="feature-link">了解更多 →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📰</div>
          <h3 class="feature-title">润学周报</h3>
          <p class="feature-description">
            每周精选留学移民资讯、政策变化和实用信息
          </p>
          <router-link to="/weekly_update" class="feature-link">查看周报 →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📡</div>
          <h3 class="feature-title">留学前线</h3>
          <p class="feature-description">
            每日更新全球留学与移民动态，捕捉最新政策
          </p>
          <router-link to="/studywire" class="feature-link">浏览前线 →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🤝</div>
          <h3 class="feature-title">社区互助</h3>
          <p class="feature-description">
            友善密集的交流空间，分享经验互相帮助
          </p>
          <router-link to="/track" class="feature-link">了解社群 →</router-link>
        </div>

        <!-- 赞助与服务 -->
        <div class="feature-card">
          <div class="feature-icon">💙</div>
          <h3 class="feature-title">赞助与服务</h3>
          <p class="feature-description">
            支持社区长期发展，查看鸣谢与付费服务
          </p>
          <router-link to="/support" class="feature-link">前往支持 →</router-link>
        </div>
      </div>
    </section>

    <!-- Groups Section -->
    <section id="groups" class="groups-section">
      <h2 class="section-title">📊 群组分类</h2>
      <div class="groups-content">
        <p>我们根据不同的地区和语言需求，建立了多个专门的交流群组，方便大家找到最适合的讨论环境：</p>
        <div class="group-types">
          <div class="group-type">
            <h4>主群</h4>
            <p>综合性交流，适合所有用户。</p>
          </div>
          <div class="group-type">
            <h4>地区群</h4>
            <p>美国/加拿大、澳洲/新西兰、日本、德国等地区性群组，聚焦当地政策、生活与经验分享。</p>
          </div>
          <div class="group-type">
            <h4>语言群</h4>
            <p>日语、德语等语言学习与文化交流群组，便于学习者互相支持。</p>
          </div>
        </div>
        <p class="group-note">如果您有新的细分领域群组建立需求，也欢迎联系管理团队讨论，我们会评估并协助搭建。</p>
      </div>
    </section>

    <!-- Team Section -->
    <section id="team" class="team-section">
      <h2 class="section-title">👥 核心成员</h2>
      <div class="team-grid">
        <!-- zhenmunse -->
        <div class="team-card">
          <div class="team-info">
            <div class="team-header">
              <h3 class="team-name">zhenmunse</h3>
              <p class="team-role">润物有声项目联合创始人</p>
            </div>
            <p class="team-bio">
              润物有声项目联合创始人，致力于以半公益模式降低传统留学路径的时间与经济成本，提供更透明、高效的升学规划支持。擅长留学策略、国际课程体系与学术内容构建。
            </p>
          </div>
          <div class="team-links">
            <a href="https://space.bilibili.com/483394058" target="_blank" rel="noopener noreferrer" class="social-link" title="哔哩哔哩">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
              </svg>
            </a>
            <a href="https://github.com/zhenmunse" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Wille_007 -->
        <div class="team-card">
          <div class="team-info">
            <div class="team-header">
              <h3 class="team-name">Wille_007</h3>
              <p class="team-role">润物有声项目联合创始人</p>
            </div>
            <p class="team-bio">
              留学与移民政策科普创作者，长期关注全球教育、签证与移民趋势，用数据与案例解析复杂政策，帮助学生和家庭做出理性选择。擅长内容策划与国际教育信息整合。
            </p>
          </div>
          <div class="team-links">
            <a href="https://space.bilibili.com/3546888376682496" target="_blank" rel="noopener noreferrer" class="social-link" title="哔哩哔哩">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- 润党_Leighton -->
        <div class="team-card">
          <div class="team-info">
            <div class="team-header">
              <h3 class="team-name">润党_Leighton</h3>
              <p class="team-role"><!-- 地位待补充 --></p>
            </div>
            <p class="team-bio">
              <!-- 简介待补充 -->
            </p>
          </div>
          <div class="team-links">
            <a href="https://space.bilibili.com/3546658184890390" target="_blank" rel="noopener noreferrer" class="social-link" title="哔哩哔哩">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- 00后HR伯乐 -->
        <div class="team-card">
          <div class="team-info">
            <div class="team-header">
              <h3 class="team-name">00后HR伯乐</h3>
              <p class="team-role">润物有声项目核心成员</p>
            </div>
            <p class="team-bio">
              可能是团队中最普通的一个，但普通人最懂如何教普通人。我的目标是人人可以复刻我的pte90分！专门针对零基础，保姆级幼教级。
            </p>
          </div>
          <div class="team-links">
            <a href="https://space.bilibili.com/287637403" target="_blank" rel="noopener noreferrer" class="social-link" title="哔哩哔哩">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section id="stats" class="stats-section">
      <h2 class="section-title">📈 我们的成就</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">6+</div>
          <div class="stat-label">QQ群组</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">数千</div>
          <div class="stat-label">活跃成员</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">每周</div>
          <div class="stat-label">资讯更新</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">全球</div>
          <div class="stat-label">覆盖范围</div>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 侧边导航菜单配置
const navItems = [
  { id: 'hero', label: '首页' },
  { id: 'features', label: '特色' },
  { id: 'groups', label: '群组' },
  { id: 'team', label: '团队' },
  { id: 'stats', label: '成就' }
];

// 当前激活的区块、浮标位置、导航显示状态
const activeSection = ref('hero');
const indicatorTop = ref(0);
const showNav = ref(false);

// 平滑滚动到指定区块
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    const offsetTop = element.offsetTop - 80; // 减去固定头部高度
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// 根据滚动位置更新激活区块和浮标位置
function updateActiveSection() {
  const sections = navItems.map(item => ({
    id: item.id,
    element: document.getElementById(item.id)
  })).filter(s => s.element);

  const scrollPosition = window.scrollY + 150; // 偏移量优化触发点

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section.element.offsetTop <= scrollPosition) {
      activeSection.value = section.id;
      
      // 更新浮标位置
      const navIndex = navItems.findIndex(item => item.id === section.id);
      indicatorTop.value = navIndex * 48; // 每个导航项 48px
      break;
    }
  }

  // 滚动超过首屏后显示侧边导航
  showNav.value = window.scrollY > 300;
}

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection);
});
</script>

<style scoped>
.home-wrapper {
  position: relative;
  width: 100%;
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

/* 侧边导航栏 */
.side-nav {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.side-nav.visible {
  opacity: 1;
  pointer-events: auto;
}

.side-nav::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(110, 168, 254, 0.2);
  border-radius: 2px;
}

/* 导航浮标指示器 */
.nav-indicator {
  position: absolute;
  left: 8px;
  width: 10px;
  height: 40px;
  background: linear-gradient(135deg, var(--accent), #7dd3fc);
  border-radius: 5px;
  transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(110, 168, 254, 0.5);
}

/* 侧边导航链接 */
.nav-link {
  position: relative;
  padding: 12px 12px 12px 32px;
  color: var(--muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--accent);
  background: rgba(110, 168, 254, 0.12);
  transform: translateX(2px);
}

.nav-link.active {
  color: var(--accent);
  font-weight: 600;
}

[data-theme="light"] .side-nav::before {
  background: rgba(29, 78, 216, 0.2);
}

[data-theme="light"] .nav-link {
  color: rgba(15, 23, 36, 0.7);
}

[data-theme="light"] .nav-link:hover,
[data-theme="light"] .nav-link.active {
  color: #1d4ed8;
}

[data-theme="light"] .nav-link:hover {
  background: rgba(29, 78, 216, 0.1);
}

/* Hero Section */
/* 首屏区块 */
.hero-section {
  text-align: center;
  padding: 60px 20px 40px;
  max-width: 1200px;
  margin: 0 auto 40px;
}

.hero-content {
  max-width: min(90%, 1600px); /* 响应式宽度：页面 90% 或最大 1600px */
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  margin: 0 0 24px 0;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.03em;
  line-height: 1.1;
  position: relative;
  display: inline-block;
}

.hero-title::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  background: var(--accent);
  filter: blur(60px);
  opacity: 0.15;
  transform: translate(-50%, -50%);
  z-index: -1;
  pointer-events: none;
}

.hero-subtitle {
  font-size: 24px;
  margin: 0 0 32px 0;
  opacity: 0.9;
}

.hero-description {
  text-align: left;
  max-width: min(90%, 1400px); /* 响应式宽度：页面 90% 或最大 1400px */
  margin: 0 auto;
}

.hero-description p {
  font-size: 16px;
  line-height: 1.8;
  opacity: 0.85;
  margin: 0 0 16px 0;
  color: var(--muted);
}

.hero-description p:last-child {
  margin-bottom: 0;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 按钮通用样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

.btn-primary {
  background: linear-gradient(90deg, var(--accent), #7dd3fc);
  color: #04263b;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--accent);
  color: var(--accent);
}

.btn-icon {
  font-size: 20px;
}

/* 特色功能区块 */
.features-section {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 32px 0;
  background: linear-gradient(90deg, var(--accent), #7dd3fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* 特色功能卡片 */
.feature-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at top right, var(--accent-glow), transparent 40%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(56, 189, 248, 0.1);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.feature-description {
  color: var(--muted);
  line-height: 1.6;
  margin: 0 0 16px 0;
}

/* 功能卡片链接 */
.feature-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-link:hover {
  opacity: 0.75;
  transform: translateX(4px);
}

/* 群组分类区块 */
.groups-section {
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.groups-content {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
}

.groups-content > p {
  color: var(--muted);
  line-height: 1.8;
  margin: 0 0 24px 0;
  font-size: 16px;
}

.group-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

/* 群组类型卡片 */
.group-type {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group-type:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(110, 168, 254, 0.15);
}

.group-type h4 {
  color: var(--accent);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.group-type p {
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

.group-note {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
  opacity: 0.8;
}

[data-theme="light"] .groups-content {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .group-type {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(0, 0, 0, 0.08);
}

[data-theme="light"] .group-type h4 {
  color: #1d4ed8;
}

/* 团队成员区块 */
.team-section {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.team-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;
}

/* 团队成员卡片 */
.team-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  position: relative;
}

.team-card:hover {
  transform: translateY(-4px) scale(1.01);
  border-color: var(--accent);
  box-shadow: var(--shadow-lg);
  background: var(--surface);
}

.team-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0; /* 允许内容自适应缩小 */
}

.team-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.team-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.team-role {
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
  margin: 0;
}

.team-bio {
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
  font-size: 14px;
}

/* 社交链接容器 - 固定宽度，支持换行 */
.team-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 92px; /* 固定宽度：2个图标 (40px * 2 + gap 12px) */
  flex-shrink: 0;
}

/* 社交链接按钮 */
.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.social-link:hover {
  background: var(--accent);
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(110, 168, 254, 0.4);
}

.social-icon {
  width: 20px;
  height: 20px;
  fill: var(--muted);
  transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-link:hover .social-icon {
  fill: #ffffff;
}

/* 成就数据区块 */
.stats-section {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
  padding: 32px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-gradient);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}

.stat-card:hover::after {
  transform: scaleX(1);
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(90deg, var(--accent), #7dd3fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  opacity: 0.8;
}

/* Light theme adjustments */
[data-theme="light"] .feature-card,
[data-theme="light"] .team-card,
[data-theme="light"] .stat-card {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .hero-title {
  background: linear-gradient(90deg, #1a365d, #2d5a8f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="light"] .section-title {
  background: linear-gradient(90deg, #1a365d, #2d5a8f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Responsive */
@media (max-width: 1024px) {
  .side-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 40px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .hero-description {
    font-size: 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .group-types {
    grid-template-columns: 1fr;
  }

  .team-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }

  .team-links {
    width: auto; /* 移动端取消固定宽度 */
    align-self: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

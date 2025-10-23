<template>
  <div class="support-wrapper">
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

    <section id="hero" class="hero">
      <h1 class="page-title">💙 赞助与服务</h1>
      <p class="page-subtitle">如果你认同我们的价值观，愿意支持这个互助社区的发展，欢迎赞助；我们也会提供部分定制化的服务来反哺社区。</p>
    </section>

    <!-- 无偿赞助 -->
    <section id="donate" class="donate-section">
      <h2 class="section-title">🙌 无偿赞助</h2>
      
      <!-- 赞助说明 -->
      <div class="donate-intro">
        <p>作为一个完全由社区驱动的互助平台，我们致力于为每一位留学、移民的朋友提供高质量的信息与服务。然而，网站的运营维护、服务器费用、内容建设等都需要持续的资金支持。</p>
        <p>您的每一份赞助，都将直接用于：</p>
        <div class="donate-usage">
          <div class="usage-item">
            <span class="usage-icon">🖥️</span>
            <span class="usage-text">服务器与域名维护</span>
          </div>
          <div class="usage-item">
            <span class="usage-icon">📚</span>
            <span class="usage-text">优质内容制作</span>
          </div>
          <div class="usage-item">
            <span class="usage-icon">🛠️</span>
            <span class="usage-text">功能开发与优化</span>
          </div>
          <div class="usage-item">
            <span class="usage-icon">💡</span>
            <span class="usage-text">社区活动支持</span>
          </div>
        </div>
      </div>

      <div class="donate-grid">
        <div class="donate-card qr-card">
          <h3>微信收款码</h3>
          <p class="muted">打开微信扫一扫进行赞助</p>
          <div class="qr-box">
            <img
              :src="qrSrc"
              alt="微信收款码"
              class="qr-image"
              @error="onQrError"
            />
            <div v-if="qrFallback" class="qr-tip">未检测到本地收款码，已显示占位图。请将图片放到 /public/assets/images/payment_code.jpg</div>
            <div class="qr-note">因为人在海外，微信赞助可能会有风险提示，跳过即可</div>
          </div>
        </div>

        <div class="donate-card benefits-card">
          <h3>赞助者权益</h3>
          <p class="muted">感谢您的支持！赞助者将获得：</p>
          <div class="benefits-list">
            <div class="benefit-item">
              <div class="benefit-icon">🌟</div>
              <div class="benefit-content">
                <h4>鸣谢名单</h4>
                <p>您的名字将出现在网站鸣谢名单中</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">⚡</div>
              <div class="benefit-content">
                <h4>优先功能请求</h4>
                <p>您提出的功能需求将被优先考虑实现</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">🚀</div>
              <div class="benefit-content">
                <h4>预览版体验</h4>
                <p>抢先体验网站的新功能和预览版本</p>
              </div>
            </div>
          </div>
        </div>

        <div class="donate-card contribute-card">
          <h3>其他支持方式</h3>
          <p class="muted">除资金赞助外，还可以通过以下方式支持我们：</p>
          <div class="contribute-ways">
            <div class="contribute-item">
              <span class="contribute-icon">🔗</span>
              <div class="contribute-text">
                <strong>分享推广</strong>
                <span>转发网站给有需要的朋友</span>
              </div>
            </div>
            <div class="contribute-item">
              <span class="contribute-icon">💬</span>
              <div class="contribute-text">
                <strong>经验分享</strong>
                <span>在群内分享你的留学经验与资源</span>
              </div>
            </div>
            <div class="contribute-item">
              <span class="contribute-icon">
                <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </span>
              <div class="contribute-text">
                <strong>代码贡献</strong>
                <span>
                  为
                  <a href="https://github.com/zhenmunse/run_global" target="_blank" rel="noopener noreferrer" class="github-link">
                    <svg height="13" width="13" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: text-bottom; margin-right: 3px;">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>项目仓库
                  </a>贡献文档或代码
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 鸣谢 -->
    <section id="thanks" class="thanks-section">
      <h2 class="section-title">🎉 鸣谢名单</h2>
      
      <!-- 核心成员 -->
      <div class="thanks-group">
        <h3 class="group-title">核心成员</h3>
        <div class="thanks-board">
          <ul class="thanks-list">
            <li v-for="(item, idx) in coreMembers" :key="idx" class="thanks-item">
              <span class="name">{{ item.name }}</span>
              <span class="type core">核心</span>
              <span class="note" v-if="item.note">{{ item.note }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 其他贡献者 -->
      <div class="thanks-group">
        <h3 class="group-title">其他贡献者</h3>
        <p class="muted" style="text-align:center;margin-top:-4px;margin-bottom:12px;">对项目提供赞助或做出代码贡献的朋友（排名不分先后）</p>
        <div class="thanks-board" :class="{ scroll: isScrollable }">
          <ul class="thanks-list" :style="scrollStyle">
            <li v-for="(item, idx) in displayList" :key="idx" class="thanks-item">
              <span class="name">{{ item.name }}</span>
              <span class="type" :class="item.type">{{ item.type === 'sponsor' ? '赞助' : '贡献' }}</span>
              <span class="note" v-if="item.note">{{ item.note }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 综合服务（内框：搜索 + Tag 筛选 + 卡片） -->
    <section id="services" class="service-section all-services">
      <h2 class="section-title">服务目录</h2>
      
      <!-- 免费服务说明 -->
      <div class="plan-intro-single free-plan">
        <div class="plan-badge">💚 免费服务</div>
        <h3>互助社区 · 开放共享</h3>
        <p>我们提供短时咨询答疑、资料检索指引、群内互助问答等完全免费的服务，帮助每一位有出国意向的同学获得基础支持。此外，我们还免费提供日本语言学校申请以及澳新马合作院校申请服务，让留学之路更加顺畅。</p>
        <ul class="plan-features inline-features">
          <li>✓ 短时咨询完全免费</li>
          <li>✓ 资料检索指引</li>
          <li>✓ 全球群友互助问答</li>
          <li>✓ 日本语言学校免费申请</li>
          <li>✓ 澳新马合作院校免费申请</li>
        </ul>
      </div>
      
      <!-- 付费服务计划说明 -->
      <div class="plan-intro-grid">
        <div class="plan-intro-card cgd-plan">
          <div class="plan-badge">💰 "闯关东"计划</div>
          <h3>半公益性质 · 高性价比</h3>
          <p>我们的高性价比服务品牌，适用于计划前往欧洲大陆、港澳、新加坡、马来西亚等地区攻读本科及硕士的学生群体。通过 AI 辅助+人工优化模式，提供结构清晰、流程明确的标准化服务。</p>
          <ul class="plan-features">
            <li>🌟 <strong>半公益性质</strong>，仅收取必要开发费用</li>
            <li>💚 所得收益用于补贴项目和网站运行</li>
            <li>✓ AI 生成初稿 + 人工润色 2 轮</li>
            <li>✓ 适合非顶校项目，追求性价比</li>
            <li>✓ 打包价格透明，无隐藏费用</li>
          </ul>
          <p class="plan-note">⚠️ 注意：文书为 人工初稿 / AI 辅助 + 人工润色产出，反馈次数限 1 次</p>
        </div>
        
        <div class="plan-intro-card vip-plan">
          <div class="plan-badge">🏆 VIP 留学移民服务</div>
          <h3>专业定制 · 全程护航</h3>
          <p>涵盖授课辅导、申请咨询、文书打磨、面试培训、签证指导等全方位支持。无论是冲刺世界名校，还是规划多国混申，我们都配备专业团队，提供深度个性化服务，杜绝纯 AI 创作，确保高质量交付。</p>
          <ul class="plan-features">
            <li>🌟 <strong>同等质量、价格更低</strong></li>
            <li>💚 部分收益用于补贴项目和网站运行</li>
            <li>✓ 一对一深度沟通，量身定制方案</li>
            <li>✓ 顶尖院校申请经验丰富</li>
            <li>✓ 专业文书打磨，杜绝模板化</li>
            <li>✓ 涵盖授课、申请、签证全流程</li>
          </ul>
        </div>
      </div>
      
      <div class="services-box">
        <!-- 工具栏：搜索 + 标签筛选 -->
        <div class="toolbar">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索服务（标题、描述、要点）…"
            aria-label="搜索服务"
          />
          <div class="tag-filter">
            <button
              v-for="tag in FILTERS"
              :key="tag"
              class="tag-chip"
              :class="[tagClass(tag), { active: selectedTags.includes(tag) }, { featured: isFeatured(tag) }]"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- 服务卡片网格（统一渲染） -->
        <div class="service-grid">
          <div
            v-for="svc in filteredServices"
            :key="svc.id"
            class="service-card"
          >
            <h3>{{ svc.title }}</h3>
            <p class="muted" v-if="svc.desc">{{ svc.desc }}</p>
            <ul class="list" v-if="svc.items && svc.items.length">
              <li v-for="(li, i) in svc.items" :key="i">{{ li }}</li>
            </ul>
            <div class="meta" v-if="svc.meta">{{ svc.meta }}</div>
            <div class="mini-tags" v-if="svc.tags && svc.tags.length">
              <span class="mini-tag" v-for="(t, i) in svc.tags" :key="i">{{ t }}</span>
            </div>
          </div>
        </div>
        <p v-if="!filteredServices.length" class="muted" style="text-align:center;margin-top:8px;">未找到匹配的服务，试试更换关键词或筛选条件。</p>
      </div>
    </section>

    <!-- 右侧固定联系浮窗（大屏显示，不影响居中布局） -->
    <aside class="contact-aside" aria-label="联系与下单">
      <div class="contact-card">
        <div class="contact-icon">💬</div>
        <h3 class="contact-title">需要帮助？</h3>
        <p class="contact-desc">浏览服务后有任何疑问或意向，欢迎随时联系我们</p>
        
        <div class="contact-steps">
          <div class="step-item">
            <span class="step-num">1</span>
            <span class="step-text">选择心仪服务</span>
          </div>
          <div class="step-item">
            <span class="step-num">2</span>
            <span class="step-text">说明需求与档位</span>
          </div>
          <div class="step-item">
            <span class="step-num">3</span>
            <span class="step-text">快速获得回复</span>
          </div>
        </div>
        
        <router-link to="/contact" class="contact-cta">
          <span>立即联系</span>
          <span class="arrow">→</span>
        </router-link>
        
        <div class="contact-note">
          <span class="note-icon">⚡</span>
          <span>通常 24 小时内回复</span>
        </div>
      </div>
    </aside>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// =============================
// 侧边导航配置
// =============================

const navItems = [
  { id: 'hero', label: '首页' },
  { id: 'donate', label: '赞助' },
  { id: 'thanks', label: '鸣谢' },
  { id: 'services', label: '服务' }
];

const activeSection = ref('hero');
const indicatorTop = ref(0);
const showNav = ref(false);

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

function updateActiveSection() {
  const sections = navItems.map(item => ({
    id: item.id,
    element: document.getElementById(item.id)
  })).filter(s => s.element);

  const scrollPosition = window.scrollY + 150;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section.element.offsetTop <= scrollPosition) {
      activeSection.value = section.id;
      
      const navIndex = navItems.findIndex(item => item.id === section.id);
      indicatorTop.value = navIndex * 48;
      break;
    }
  }

  showNav.value = window.scrollY > 300;
}

// =============================
// 微信收款码
// =============================

const qrFallback = ref(false)
const qrSrc = ref('/assets/images/payment_code.jpg')
function onQrError() {
  if (!qrFallback.value) {
    qrFallback.value = true
    qrSrc.value = '/assets/images/wxpay-placeholder.svg'
  }
}

// =============================
// 鸣谢数据
// =============================

// 核心成员（写死在代码中）
const coreMembers = ref([
  { name: 'zhenmunse', note: '项目联合创始人 · 前端与架构' },
  { name: 'Wille_007', note: '项目联合创始人 · 内容策划' },
  { name: '00后HR伯乐', note: '核心成员 · 语言学习内容' },
  { name: '润党_Leighton', note: '核心成员' },
])

// 其他贡献者（代码贡献/赞助）- 从 JSON 文件加载
const thanks = ref([])

// 加载其他贡献者数据
async function loadThanks() {
  try {
    const response = await fetch('/data/thanks.json')
    if (!response.ok) throw new Error('Failed to load thanks')
    const data = await response.json()
    thanks.value = data
  } catch (error) {
    console.error('Error loading thanks:', error)
  }
}

const SCROLL_THRESHOLD = 6
const isScrollable = computed(() => thanks.value.length > SCROLL_THRESHOLD)
// 为无缝循环构造一份重复列表（仅当需要滚动时）
const displayList = computed(() => isScrollable.value ? [...thanks.value, ...thanks.value] : thanks.value)
// 根据条数设置动画时长，条目越多，周期越长
const scrollStyle = computed(() => isScrollable.value ? ({ animationDuration: `${thanks.value.length * 2}s` }) : {})

// =============================
// 服务数据与筛选/搜索逻辑
// =============================

// 筛选器分类（显示文案要与数据中的 category 完全一致）
const FILTERS = [
  '免费服务',
  '"闯关东"计划',
  'VIP 留学移民服务',
]

const featuredTags = new Set(['免费服务', '"闯关东"计划']) // 醒目显示的标签
const selectedTags = ref([]) // 默认全不选（空数组 = 显示全部服务）
const searchQuery = ref('')

function isFeatured(tag) {
  return featuredTags.has(tag)
}

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// 标签类型映射（用于配色）
function tagClass(tag) {
  if (tag.includes('VIP')) return 'vip'
  if (tag.includes('闯关东')) return 'cgd'
  if (tag.includes('免费')) return 'free'
  return ''
}

// 统一服务列表（从 JSON 文件加载）
const allServices = ref([])

// 加载服务数据
async function loadServices() {
  try {
    const response = await fetch('/data/services.json')
    if (!response.ok) throw new Error('Failed to load services')
    const data = await response.json()
    allServices.value = data
  } catch (error) {
    console.error('Error loading services:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadServices()
  loadThanks()
  window.addEventListener('scroll', updateActiveSection)
  updateActiveSection()
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})

// 下面的代码保留作为参考（已废弃，数据现在从 JSON 加载）
/*
let id = 1
const S = (o) => ({ id: id++, ...o })
const OLD_allServices = ref([
  // 免费服务
  S({
    category: '免费服务',
    title: '短时咨询答疑',
    desc: '围绕留学/移民路径、选校方向等核心问题，提供 15–20 分钟快速答疑，帮你迅速理清思路。',
    meta: '时长：15–20 分钟｜方式：QQ/微信语音',
    link: '/contact',
    cta: '联系咨询 →',
    tags: ['免费','咨询'],
  }),
  S({
    category: '免费服务',
    title: '资料检索指引',
    desc: '梳理官方政策与学校信息的可靠来源，手把手教你高效检索方法。',
    meta: '适合：信息检索困难｜交付：资源清单',
    link: '/contact',
    cta: '申请指引 →',
    tags: ['免费','资料'],
  }),
  S({
    category: '免费服务',
    title: '群内互助问答',
    desc: '加入 QQ 群，与全球群友交流经验、分享资源，获得社区的集体智慧支持。',
    meta: '覆盖：主流留学/移民目的地｜响应快',
    link: '/track',
    cta: '加入社群 →',
    tags: ['免费','社群'],
  }),

  // VIP 留学移民服务
  S({
    category: 'VIP 留学移民服务',
    title: '留学移民咨询',
    desc: '1 对 1 深度沟通，给出路径选择建议与可行方案；可自由选择咨询老师；可选通用咨询或国别专项。',
    meta: '时长：60 min',
    link: '/contact',
    cta: '先联系我 →',
    tags: ['VIP','咨询'],
  }),
  S({
    category: 'VIP 留学移民服务',
    title: '文书面试辅导',
    desc: '按目标项目要求，梳理经历与亮点、把握院校偏好；打磨全英文书，并带练全英面试。',
    meta: '特点：杜绝纯 AI 创作',
    link: '/contact',
    cta: '先联系我 →',
    tags: ['VIP','文书','面试'],
  }),
  S({
    category: 'VIP 留学移民服务',
    title: '语言备考辅导',
    desc: '提供 1 对 1 或小班授课；老师语言成绩与辅导经验过硬；价格优于常见外包机构。',
    meta: '覆盖：IELTS / PTE / TOEFL',
    link: '/contact',
    cta: '先联系我 →',
    tags: ['VIP','语言'],
  }),
  S({
    category: 'VIP 留学移民服务',
    title: '留学服务申请',
    desc: '基础咨询 + 全流程申请服务；以丰富经验帮你避坑，免去繁琐的院校沟通与材料准备。',
    meta: '交付物：院校 offer',
    link: '/contact',
    cta: '先联系我 →',
    tags: ['VIP','申请'],
  }),

  // "闯关东"计划（高性价比）
  S({
    category: '"闯关东"计划',
    title: '申请服务',
    desc: '包含文书、材料提交与申请系统处理，价格透明，高性价比。',
    meta: '1800/所｜3 所 5000｜5 所 7000',
    link: '/contact',
    cta: '了解与下单 →',
    tags: ['闯关东','申请','打包'],
  }),
  S({
    category: '"闯关东"计划',
    title: '本科文书服务',
    desc: '适用于转学美本、日本 SGU、各类奖学金等项目。',
    items: [
      '个人陈述 / 动机信：1200',
      '简历（CV）：800',
      '推荐信润色建议：800',
    ],
    meta: '打包价：2500',
    link: '/contact',
    cta: '了解与下单 →',
    tags: ['闯关东','本科','文书'],
  }),
  S({
    category: '"闯关东"计划',
    title: '硕士文书服务',
    desc: '面向研究型硕士、日本 SGU、各类奖学金等需文书项目。',
    meta: '简历 / 个人陈述 / 动机信：1200/封（AI 初稿 + 人工润色）',
    link: '/contact',
    cta: '了解与下单 →',
    tags: ['闯关东','硕士','文书'],
  }),
  S({
    category: '"闯关东"计划',
    title: '研究计划（轻度）',
    desc: '提供结构框架与 1 轮语义润色。',
    meta: '3000',
    link: '/contact',
    cta: '了解与下单 →',
    tags: ['闯关东','研究计划','文书'],
  }),
])
*/

const filteredServices = computed(() => {
  const qs = searchQuery.value.trim().toLowerCase()
  const activeTags = selectedTags.value.length ? selectedTags.value : FILTERS
  const hasTag = (svc) => activeTags.includes(svc.category)
  const matchText = (svc) => {
    if (!qs) return true
    const hay = [svc.title, svc.desc, svc.meta, ...(svc.items || [])]
      .filter(Boolean)
      .join('\n')
      .toLowerCase()
    return hay.includes(qs)
  }
  return allServices.value.filter((s) => hasTag(s) && matchText(s))
})
</script>

<style scoped>
.support-wrapper {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  padding: 24px 20px 40px;
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

.hero {
  text-align: center;
  margin-bottom: 12px;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(90deg, var(--accent), #7dd3fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: var(--muted);
  line-height: 1.7;
  margin: 0 auto;
  max-width: min(90%, 1400px); /* 响应式宽度：页面 90% 或最大 1400px */
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 20px 0;
  background: linear-gradient(90deg, var(--accent), #7dd3fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.muted {
  color: var(--muted);
}

/* 无偿赞助 */
.donate-section {
  padding: 24px 0 8px;
}

.donate-intro {
  background: linear-gradient(135deg, rgba(110, 168, 254, 0.08) 0%, rgba(110, 168, 254, 0.03) 100%);
  border: 1px solid rgba(110, 168, 254, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.donate-intro p {
  margin: 0 0 16px 0;
  line-height: 1.7;
  color: var(--text);
}

.donate-intro p:last-of-type {
  margin-bottom: 12px;
}

.donate-usage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.usage-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.usage-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(110, 168, 254, 0.3);
  transform: translateY(-2px);
}

.usage-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.usage-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.donate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.donate-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.donate-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 8px 20px rgba(110, 168, 254, 0.2);
}

.qr-card {
  grid-column: span 1;
}

.benefits-card {
  grid-column: span 1;
}

.contribute-card {
  grid-column: span 1;
}

@media (min-width: 1200px) {
  .donate-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.qr-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.qr-image {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  object-fit: cover;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
}

.qr-tip {
  font-size: 12px;
  color: var(--muted);
}

.qr-note {
  font-size: 13px;
  color: var(--accent);
  background: rgba(110, 168, 254, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(110, 168, 254, 0.2);
  margin-top: 8px;
  text-align: center;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(110, 168, 254, 0.05);
  border: 1px solid rgba(110, 168, 254, 0.15);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.benefit-item:hover {
  background: rgba(110, 168, 254, 0.08);
  border-color: rgba(110, 168, 254, 0.3);
  transform: translateX(4px);
}

.benefit-icon {
  font-size: 24px;
  flex-shrink: 0;
  line-height: 1;
}

.benefit-content h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.benefit-content p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
}

.contribute-ways {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.contribute-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.contribute-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(110, 168, 254, 0.3);
  transform: translateX(4px);
}

.contribute-icon {
  font-size: 20px;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 2px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contribute-icon svg {
  display: block;
}

.contribute-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contribute-text strong {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.contribute-text span {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}

.github-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.github-link:hover {
  color: #6ea8fe;
  text-decoration: underline;
}

.list {
  margin: 12px 0 0 16px;
  padding: 0;
  line-height: 1.8;
}

/* 鸣谢 */
.thanks-section {
  padding: 24px 0;
}

.thanks-group {
  margin-bottom: 24px;
}

.thanks-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--accent);
  text-align: center;
  margin: 0 0 12px 0;
}

.thanks-board {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px 0;
}

.thanks-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.thanks-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px dashed rgba(255,255,255,0.08);
}

.thanks-item:last-child {
  border-bottom: none;
}

.thanks-item .name {
  font-weight: 600;
}

.thanks-item .type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.16);
  color: #7dd3fc;
}

.thanks-item .type.sponsor {
  background: rgba(34, 197, 94, 0.16);
  color: #34d399;
}

.thanks-item .type.core {
  background: rgba(251, 191, 36, 0.16);
  color: #fbbf24;
}

/* 超过阈值时滚动 */
.thanks-board.scroll {
  height: 220px;
}

.thanks-board.scroll .thanks-list {
  animation-name: vertical-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes vertical-scroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

/* 服务区块（免费/付费） */
.service-section {
  padding: 16px 0 8px;
}

/* 服务计划说明卡片 */
.plan-intro-single {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.plan-intro-single.free-plan {
  border-color: rgba(34, 197, 94, 0.3);
  background: linear-gradient(145deg, rgba(34, 197, 94, 0.05), rgba(255, 255, 255, 0.02));
}

.plan-intro-single.free-plan:hover {
  border-color: rgba(34, 197, 94, 0.5);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.15);
}

.plan-intro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.plan-intro-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.plan-intro-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.plan-intro-card.vip-plan {
  border-color: rgba(251, 191, 36, 0.3);
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.05), rgba(255, 255, 255, 0.02));
}

.plan-intro-card.vip-plan:hover {
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.2);
}

.plan-intro-card.cgd-plan {
  border-color: rgba(29, 78, 216, 0.3);
  background: linear-gradient(145deg, rgba(29, 78, 216, 0.05), rgba(255, 255, 255, 0.02));
}

.plan-intro-card.cgd-plan:hover {
  border-color: rgba(29, 78, 216, 0.5);
  box-shadow: 0 8px 24px rgba(29, 78, 216, 0.2);
}

.plan-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.free-plan .plan-badge {
  background: linear-gradient(90deg, #059669, #10b981);
  color: #ffffff;
}

.vip-plan .plan-badge {
  background: linear-gradient(90deg, #d97706, #f59e0b);
  color: #ffffff;
}

.cgd-plan .plan-badge {
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
  color: #ffffff;
}

.plan-intro-card h3,
.plan-intro-single h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--text-primary);
}

.plan-intro-card > p,
.plan-intro-single > p {
  color: var(--muted);
  line-height: 1.7;
  margin: 0 0 16px 0;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.plan-features li {
  padding: 6px 0;
  color: var(--text-primary);
  line-height: 1.6;
}

.plan-features li strong {
  color: var(--accent);
}

/* 横向排列的特性列表（用于免费服务） */
.plan-features.inline-features {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.plan-features.inline-features li {
  padding: 8px 16px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 999px;
  font-size: 14px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  transition: all 0.2s ease;
}

.plan-features.inline-features li:hover {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
  transform: translateY(-2px);
}

.plan-note {
  font-size: 13px;
  color: var(--muted);
  padding: 12px;
  background: rgba(234, 179, 8, 0.1);
  border-left: 3px solid #f59e0b;
  border-radius: 6px;
  margin: 16px 0 0 0;
  line-height: 1.6;
}

/* 亮色主题下的计划卡片 */
[data-theme="light"] .plan-intro-single,
[data-theme="light"] .plan-intro-card {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .plan-intro-single.free-plan {
  background: linear-gradient(145deg, rgba(34, 197, 94, 0.08), rgba(255, 255, 255, 0.9));
  border-color: rgba(34, 197, 94, 0.3);
}

[data-theme="light"] .plan-intro-card.vip-plan {
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.08), rgba(255, 255, 255, 0.9));
  border-color: rgba(251, 191, 36, 0.3);
}

[data-theme="light"] .plan-intro-card.cgd-plan {
  background: linear-gradient(145deg, rgba(29, 78, 216, 0.08), rgba(255, 255, 255, 0.9));
  border-color: rgba(29, 78, 216, 0.3);
}

[data-theme="light"] .plan-note {
  background: rgba(234, 179, 8, 0.15);
  border-left-color: #d97706;
}

[data-theme="light"] .plan-features.inline-features li {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
}

[data-theme="light"] .plan-features.inline-features li:hover {
  background: rgba(34, 197, 94, 0.25);
  border-color: rgba(34, 197, 94, 0.4);
}

.service-intro {
  text-align: center;
  color: var(--muted);
  line-height: 1.7;
  margin: -8px auto 20px;
  max-width: min(90%, 1400px); /* 响应式宽度：页面 90% 或最大 1400px */
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.service-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 8px 20px rgba(110, 168, 254, 0.2);
}

.service-card .meta {
  font-size: 12px;
  color: var(--muted);
}

.btn.btn-ghost {
  align-self: flex-start;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid var(--accent);
  color: var(--accent);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn.btn-ghost:hover {
  transform: translateY(-3px);
  background: var(--accent);
  color: #04263b;
}

/* 内框与工具栏 */
.services-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.search-input {
  flex: 1 1 260px;
  min-width: 220px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--glass);
  color: inherit;
  outline: none;
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(110,168,254,0.2);
}

.tag-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-chip {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: all .2s ease;
  opacity: 0.8;
}

.tag-chip:hover { transform: translateY(-2px); }

.tag-chip.active {
  border-color: transparent;
  color: #04263b;
  opacity: 1;
}

.tag-chip.featured { /* 醒目显示的标签 */
  font-weight: 700;
}

.mini-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.mini-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.16);
  color: #7dd3fc;
}

/* 不同 Tag 颜色（未选/选中） */
.tag-chip.free { border-color: rgba(34,197,94,0.35); color: #34d399; }
.tag-chip.free.active { 
  background: linear-gradient(90deg, #059669, #10b981); 
  color: #ffffff;
  font-weight: 600;
}
.tag-chip.cgd { border-color: rgba(29,78,216,0.35); color: #60a5fa; }
.tag-chip.cgd.active { 
  background: linear-gradient(90deg, #1d4ed8, #3b82f6); 
  color: #ffffff;
  font-weight: 600;
}
.tag-chip.vip { border-color: rgba(234,179,8,0.45); color: #fbbf24; }
.tag-chip.vip.active { 
  background: linear-gradient(90deg, #d97706, #f59e0b); 
  color: #ffffff;
  font-weight: 600;
}

/* 亮色主题标题渐变保持一致 */
[data-theme="light"] .page-title,
[data-theme="light"] .section-title {
  background: linear-gradient(90deg, #1a365d, #2d5a8f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="light"] .donate-card,
[data-theme="light"] .thanks-board,
[data-theme="light"] .service-card {
  background: rgba(255,255,255,0.8);
  border-color: rgba(0,0,0,0.1);
}

[data-theme="light"] .donate-intro {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.08) 0%, rgba(29, 78, 216, 0.03) 100%);
  border-color: rgba(29, 78, 216, 0.3);
}

[data-theme="light"] .usage-item,
[data-theme="light"] .contribute-item {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.08);
}

[data-theme="light"] .usage-item:hover,
[data-theme="light"] .contribute-item:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(29, 78, 216, 0.3);
}

[data-theme="light"] .benefit-item {
  background: rgba(29, 78, 216, 0.08);
  border-color: rgba(29, 78, 216, 0.2);
}

[data-theme="light"] .benefit-item:hover {
  background: rgba(29, 78, 216, 0.12);
  border-color: rgba(29, 78, 216, 0.35);
}

[data-theme="light"] .github-link {
  color: #1d4ed8;
}

[data-theme="light"] .github-link:hover {
  color: #1e40af;
}

[data-theme="light"] .services-box {
  background: linear-gradient(180deg, rgba(29,78,216,0.035), rgba(255,255,255,0)) , rgba(255,255,255,0.95);
}

[data-theme="light"] .qr-note {
  background: rgba(29, 78, 216, 0.1);
  border-color: rgba(29, 78, 216, 0.2);
  color: #1d4ed8;
}

[data-theme="light"] .group-title {
  color: #1d4ed8;
}

@media (max-width: 768px) {
  .page-title { font-size: 28px; }
  .side-nav { display: none; }
}

/* 亮色主题下增加轻微色差，避免“纯白”不明显 */
[data-theme="light"] .service-card {
  background: linear-gradient(180deg, rgba(29,78,216,0.04), rgba(255,255,255,0)) , rgba(255,255,255,0.9) !important;
}
[data-theme="light"] .search-input {
  background: rgba(15,23,36,0.06);
  border-color: rgba(15,23,36,0.15);
}

/* 宽屏分档微调（更舒展的网格与留白） */
@media (min-width: 1440px) {
  .service-grid { gap: 24px; }
  .service-card { padding: 22px; }
  .services-box { padding: 18px; }
}

@media (min-width: 1920px) {
  .service-grid { gap: 28px; }
  .service-card { padding: 24px; }
  .services-box { padding: 20px; }
}

@media (min-width: 3840px) { /* 4K UHD */
  .service-grid { gap: 32px; }
  .service-card { padding: 28px; }
  .services-box { padding: 24px; }
}

@media (min-width: 4096px) { /* DCI 4K 宽度 */
  .service-grid { gap: 34px; }
  .service-card { padding: 30px; }
  .services-box { padding: 26px; }
}

/* 右侧联系浮窗（仅大屏显示） */
.contact-aside {
  position: fixed;
  right: 32px;
  top: 160px;
  width: 300px;
  z-index: 10;
  /* 初始完全隐藏，避免闪烁 */
  opacity: 0;
  visibility: hidden;
  transform: translateX(40px);
}

/* 页面加载后的入场动画 */
@keyframes slideInContactAside {
  0% {
    opacity: 0;
    visibility: hidden;
    transform: translateX(40px);
  }
  1% {
    visibility: visible;
  }
  100% {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }
}

@media (min-width: 1280px) {
  .contact-aside { 
    /* 延迟 0.3s 后开始动画，持续 0.6s，与页面过渡匹配 */
    animation: slideInContactAside 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
  }
}

.contact-card {
  background: linear-gradient(145deg, rgba(110, 168, 254, 0.08), rgba(125, 211, 252, 0.08));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(110, 168, 254, 0.2);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(110, 168, 254, 0.2);
  border-color: rgba(110, 168, 254, 0.4);
}

.contact-icon {
  font-size: 48px;
  text-align: center;
  margin: 0 auto;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.contact-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin: 0;
  background: linear-gradient(90deg, var(--accent), #7dd3fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
  text-align: center;
  margin: 0;
}

.contact-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 8px 0;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.step-item:hover {
  background: rgba(110, 168, 254, 0.12);
  transform: translateX(4px);
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #7dd3fc);
  color: #04263b;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-text {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
}

.contact-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(90deg, var(--accent), #7dd3fc);
  color: #04263b;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(110, 168, 254, 0.3);
}

.contact-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(110, 168, 254, 0.5);
}

.contact-cta .arrow {
  transition: transform 0.3s ease;
}

.contact-cta:hover .arrow {
  transform: translateX(4px);
}

.contact-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(34, 197, 94, 0.12);
  border-radius: 8px;
  font-size: 12px;
  color: #34d399;
  font-weight: 600;
}

.note-icon {
  font-size: 14px;
}

/* 亮色主题适配 */
[data-theme="light"] .contact-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.95));
  border-color: rgba(29, 78, 216, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

[data-theme="light"] .contact-card:hover {
  border-color: rgba(29, 78, 216, 0.4);
  box-shadow: 0 12px 48px rgba(29, 78, 216, 0.15);
}

[data-theme="light"] .contact-title {
  background: linear-gradient(90deg, #1a365d, #2d5a8f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="light"] .step-item {
  background: rgba(29, 78, 216, 0.06);
}

[data-theme="light"] .step-item:hover {
  background: rgba(29, 78, 216, 0.12);
}

[data-theme="light"] .step-num {
  background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
  color: #ffffff;
}

[data-theme="light"] .contact-cta {
  background: linear-gradient(90deg, #1d4ed8, #0ea5e9);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(29, 78, 216, 0.3);
}

[data-theme="light"] .contact-cta:hover {
  box-shadow: 0 8px 24px rgba(29, 78, 216, 0.4);
}

[data-theme="light"] .contact-note {
  background: rgba(34, 197, 94, 0.12);
  color: #059669;
}
</style>

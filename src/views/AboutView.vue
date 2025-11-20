<template>
  <div class="wrap">
    <main>
      <div class="card hero">
        <h2>润物有声</h2>
        <h3>致力于打造新生代海外华人互助社群</h3>
        <p>我们搭建一个低门槛、高密度、快速响应的社群平台，让需要信息和经验的人能及时获得帮助与指引。</p>
      </div>

      <div class="card content">
        <h3>🎯 我们的使命</h3>
        <p>在信息传播日益重要的今天，我们深知信息差的打破对普通家庭意味着什么，但传统的 Reddit 等网站存在获取成本较高、信息密度低、滞后性等问题。</p>
        <p>因此，我们开发了一款“永不失联”的社群平台，大家可以通过本平台加入群聊，以获得最新的留学、移民相关动态，与世界各地的群友分享各个国家的经验、感悟与实用信息。</p>
        <p>我们相信，通过团队与广大群友的努力，可以共同打造出最大、最活跃的新生代海外华人互助社群。</p>
      </div>

      <div class="card content">
        <h3>💡 主要特色</h3>
        <div class="features">
          <div class="feature">
            <div class="feature-icon">🔗</div>
            <h4>多渠道备份</h4>
            <p>维护多个QQ群作为备份联系渠道，降低单点失联风险。</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🌐</div>
            <h4>网页备份</h4>
            <p>提供网页版群链接与目录，便于在不同设备与环境下快速找到入口。</p>
          </div>
          <div class="feature">
            <div class="feature-icon">📰</div>
            <h4>定期资讯</h4>
            <p>通过润学周报定期整理并分享最新消息、经验与可执行的建议。</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🤝</div>
            <h4>社区互助</h4>
            <p>建立友善、密集的交流空间，鼓励经验分享与相互帮助。</p>
          </div>
        </div>
      </div>

      <div class="card content">
        <h3>📊 群组分类</h3>
        <p>我们根据不同的地区和语言需求，建立了多个专门的交流群组，方便大家找到最适合的讨论环境：</p>
        <p><strong>主群：</strong> 综合性交流，适合所有用户。</p>
        <p><strong>地区群：</strong> 美国/加拿大、澳洲/新西兰、日本、德国等地区性群组，聚焦当地政策、生活与经验分享。</p>
        <p><strong>语言群：</strong> 日语、德语等语言学习与文化交流群组，便于学习者互相支持。</p>
        <p>如果您有新的细分领域群组建立需求，也欢迎联系管理团队讨论，我们会评估并协助搭建。</p>
      </div>

      <div class="card contact">
        <h3>📞 联系我们</h3>
        <p>如需合作、建议或想创建新的分组，请在主群内联系管理员或通过下方留言板留言，我们会尽快回复。</p>
        <p>投稿润学周报请<b>不要</b>使用下方留言板！请直接发邮件到 weeklyupdate@vineshore.org</p>
        <p>关注润学周报，获取我们的最新整理与公告。</p>
        <form @submit.prevent="submitForm" class="contact-form" novalidate>
          <div class="form-row">
            <label for="cf-name">姓名（必填）</label>
            <input type="text" v-model="form.name" id="cf-name" name="name" placeholder="您的姓名" required>
          </div>

          <div class="form-row">
            <label for="cf-email">邮箱（必填）</label>
            <input type="email" v-model="form.email" id="cf-email" name="email" placeholder="name@example.com" required>
          </div>

          <div class="form-row">
            <label for="cf-qq">QQ（选填）</label>
            <input type="text" v-model="form.qq" id="cf-qq" name="qq" placeholder="您的QQ号（可不填）" inputmode="numeric">
          </div>

          <div class="form-row">
            <label for="cf-message">留言内容（必填）</label>
            <textarea v-model="form.message" id="cf-message" name="message" rows="6" placeholder="请描述您的问题或建议…" required></textarea>
          </div>

          <input type="text" v-model="form.honey" id="cf-website" name="website" tabindex="-1" autocomplete="off" style="display:none">

          <div class="form-row">
            <div ref="turnstileContainer" class="cf-turnstile"></div>
          </div>

          <div class="form-actions">
            <button type="submit" id="cf-submit" :disabled="submitting">发送留言</button>
            <span id="cf-status" role="status" aria-live="polite">{{ statusMessage }}</span>
          </div>
        </form>

        <router-link to="/" class="link-btn" style="margin-top:16px">返回主页 →</router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const form = ref({
  name: '',
  email: '',
  qq: '',
  message: '',
  honey: ''
});
const statusMessage = ref('');
const submitting = ref(false);
const turnstileContainer = ref(null);
let tsToken = '';

// Use test sitekey for localhost, production sitekey for production
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const sitekey = isLocalhost ? '1x00000000000000000000AA' : '0x4AAAAAAB3z0RR14y0mYVTp';

const onTurnstileVerified = (token) => {
  tsToken = token || '';
};

// Make it globally accessible for the Turnstile script
window.onTurnstileVerified = onTurnstileVerified;

function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validateQQ(v) { if (!v) return true; return /^[1-9]\d{4,}$/.test(v); }

async function submitForm() {
  if (form.value.honey) return;
  if (!form.value.name) return statusMessage.value = '请填写姓名';
  if (!validateEmail(form.value.email)) return statusMessage.value = '请填写有效的邮箱地址';
  if (!validateQQ(form.value.qq)) return statusMessage.value = 'QQ号格式不正确';
  if (!form.value.message) return statusMessage.value = '请填写留言内容';
  if (form.value.message.length > 4000) return statusMessage.value = '内容过长，请精简后再提交';

  if (!tsToken) {
    statusMessage.value = '请先完成人机验证';
    return;
  }

  statusMessage.value = '发送中…';
  submitting.value = true;

  const payload = {
    name: form.value.name,
    email: form.value.email,
    qq: form.value.qq,
    message: form.value.message,
    cf_turnstile_response: tsToken
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      statusMessage.value = '发送成功，我们会尽快回复。';
      form.value = { name: '', email: '', qq: '', message: '', honey: '' };
      tsToken = '';
      try { if (window.turnstile) window.turnstile.reset(); } catch (_) {}
    } else {
      if (res.status === 403) {
        statusMessage.value = data.message || '验证失败，请重新完成人机验证';
        tsToken = '';
        try { if (window.turnstile) window.turnstile.reset(); } catch (_) {}
      } else {
        statusMessage.value = data.message || '发送失败，请稍后再试';
      }
    }
  } catch (err) {
    statusMessage.value = '网络异常，请稍后再试';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  // Check if Turnstile script is already loaded
  if (window.turnstile) {
    // Script already loaded, render immediately
    if (turnstileContainer.value) {
      try {
        window.turnstile.render(turnstileContainer.value, {
          sitekey: sitekey,
          callback: onTurnstileVerified,
          size: 'compact'
        });
      } catch (e) {
        console.error('Failed to render Turnstile:', e);
      }
    }
  } else {
    // Load script and render when ready
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.onloadTurnstileCallback = () => {
      if (turnstileContainer.value) {
        try {
          window.turnstile.render(turnstileContainer.value, {
            sitekey: sitekey,
            callback: onTurnstileVerified,
            size: 'compact'
          });
        } catch (e) {
          console.error('Failed to render Turnstile:', e);
        }
      }
    };
  }
});

onUnmounted(() => {
  // Clean up the global callback
  delete window.onTurnstileVerified;
  delete window.onloadTurnstileCallback;
});
</script>

<style scoped>
.content h3{
  font-size:20px;
  margin:0 0 16px 0;
}

/* 深色主题 */
[data-theme="dark"] .content h3 {
  color:#e6eef8;
}

/* 浅色主题 */
[data-theme="light"] .content h3 {
  color:#1a365d;
}

.content p{
  color:var(--muted);
  line-height:1.7;
  margin:0 0 16px 0;
}
.content p:last-child{
  margin-bottom:0;
}

.features{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:20px;
  margin-top:20px;
}
.feature{
  background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.04);
  border-radius:10px;
  padding:20px;
  text-align:center;
}
.feature-icon{
  font-size:32px;
  margin-bottom:12px;
}
.feature h4{
  margin:0 0 8px 0;
  font-size:16px;
}
.feature p{
  margin:0;
  font-size:14px;
  color:var(--muted);
}

.contact{
  background:rgba(110,168,254,0.05);
  border:1px solid rgba(110,168,254,0.2);
}
.contact h3{
  color:var(--accent);
}

.link-btn{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:10px 16px;
  border-radius:8px;
  background:linear-gradient(90deg,var(--accent),#7dd3fc);
  color:#04263b;
  text-decoration:none;
  font-weight:600;
  margin-top:12px;
  transition:transform 0.2s ease;
}
.link-btn:hover{
  transform:translateY(-1px);
}

/* 留言表单的局部样式 */
.contact-form{ margin-top:10px }
.contact-form .form-row{ display:flex;flex-direction:column;gap:6px;margin-bottom:12px }
.contact-form label{ font-size:13px;color:#b9c6d3 }

/* 表单输入框 - 深色主题 */
[data-theme="dark"] .contact-form input,
[data-theme="dark"] .contact-form textarea{
  background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.08);
  color:#e6eef8;
  border-radius:8px;
  padding:10px 12px;
  outline:none;
}

/* 表单输入框 - 浅色主题 */
[data-theme="light"] .contact-form input,
[data-theme="light"] .contact-form textarea{
  background:rgba(255,255,255,0.8);
  border:1px solid rgba(0,0,0,0.15);
  color:#1a365d;
  border-radius:8px;
  padding:10px 12px;
  outline:none;
}

[data-theme="light"] .contact-form input::placeholder,
[data-theme="light"] .contact-form textarea::placeholder{
  color:#64748b;
}

.contact-form input:focus,.contact-form textarea:focus{ border-color: var(--accent) }
.contact-form .form-actions{ display:flex;align-items:center;gap:12px;margin-top:8px }
#cf-submit{
  background:linear-gradient(90deg,var(--accent),#7dd3fc);
  color:#04263b; border:0; border-radius:8px; padding:10px 16px;
  font-weight:600; cursor:pointer; transition:opacity .2s ease,transform .2s ease
}
#cf-submit:disabled{ opacity:.6; cursor:default }
#cf-status{ font-size:13px;color:var(--muted) }

@media (max-width:880px){
  .card{padding:20px}
  .hero h2{font-size:28px}
  .features{grid-template-columns:1fr}
}
</style>

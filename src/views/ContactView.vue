<template>
  <div class="wrap">
    <main>
      <div class="card hero">
        <h2>📞 联系我们</h2>
        <p>如需合作、建议或想创建新的分组，请在主群内联系管理员或通过下方留言板留言，我们会尽快回复。</p>
        <p>投稿润学周报请<b>不要</b>使用下方留言板！请直接发邮件到 weeklyupdate@vineshore.org</p>
        <p>关注润学周报，获取我们的最新整理与公告。</p>
      </div>

      <div class="card contact">
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

// 表单数据
const form = ref({
  name: '',
  email: '',
  qq: '',
  message: '',
  honey: '' // 蜜罐字段，用于防止机器人提交
});
const statusMessage = ref('');
const submitting = ref(false);
const turnstileContainer = ref(null);
let tsToken = ''; // Cloudflare Turnstile 验证token

// 根据环境使用不同的 Turnstile 站点密钥
// 本地开发使用测试密钥，生产环境使用真实密钥
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const sitekey = isLocalhost ? '1x00000000000000000000AA' : '0x4AAAAAAB3z0RR14y0mYVTp';

// Turnstile 验证成功回调
const onTurnstileVerified = (token) => {
  tsToken = token || '';
};

// 将回调函数挂载到全局，供 Turnstile 脚本调用
window.onTurnstileVerified = onTurnstileVerified;

// 表单验证函数
function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validateQQ(v) { if (!v) return true; return /^[1-9]\d{4,}$/.test(v); }

// 提交表单
async function submitForm() {
  // 蜜罐字段检测：如果填写则认为是机器人，静默拒绝
  if (form.value.honey) return;
  
  // 表单验证
  if (!form.value.name) return statusMessage.value = '请填写姓名';
  if (!validateEmail(form.value.email)) return statusMessage.value = '请填写有效的邮箱地址';
  if (!validateQQ(form.value.qq)) return statusMessage.value = 'QQ号格式不正确';
  if (!form.value.message) return statusMessage.value = '请填写留言内容';
  if (form.value.message.length > 4000) return statusMessage.value = '内容过长，请精简后再提交';

  // 检查 Turnstile 验证
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
    // 调用后端 API 提交表单
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    
    if (res.ok) {
      statusMessage.value = '发送成功，我们会尽快回复。';
      // 清空表单
      form.value = { name: '', email: '', qq: '', message: '', honey: '' };
      tsToken = '';
      try { if (window.turnstile) window.turnstile.reset(); } catch (_) {}
    } else {
      // 验证失败或其他错误
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

// 组件挂载时加载 Turnstile 脚本
onMounted(() => {
  // 检查 Turnstile 脚本是否已加载
  if (window.turnstile) {
    // 脚本已加载，直接渲染
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
.contact-form{
  display:flex;
  flex-direction:column;
  gap:16px;
}
.form-row{
  display:flex;
  flex-direction:column;
  gap:6px;
}
.form-row label{
  font-weight:600;
  font-size:14px;
  color:var(--text-primary);
}

/* 深色主题输入框 */
[data-theme="dark"] .form-row input,
[data-theme="dark"] .form-row textarea {
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:8px;
  padding:10px 12px;
  color:#e6eef8;
  font-size:14px;
  font-family:inherit;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 浅色主题输入框 */
[data-theme="light"] .form-row input,
[data-theme="light"] .form-row textarea {
  background:rgba(255,255,255,0.8);
  border:1px solid rgba(15,23,36,0.2);
  border-radius:8px;
  padding:10px 12px;
  color:#1a365d;
  font-size:14px;
  font-family:inherit;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-row input:focus,
.form-row textarea:focus {
  outline:none;
  border-color:var(--accent);
  box-shadow:0 0 0 3px rgba(110,168,254,0.15);
}

.form-row input::placeholder,
.form-row textarea::placeholder {
  color:var(--muted);
  opacity:0.6;
}

.form-row textarea{
  resize:vertical;
  min-height:120px;
}
.form-actions{
  display:flex;
  align-items:center;
  gap:16px;
}
.form-actions button{
  padding:12px 24px;
  background:linear-gradient(90deg,var(--accent),#7dd3fc);
  border:none;
  border-radius:10px;
  color:#04263b;
  font-weight:600;
  font-size:14px;
  cursor:pointer;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.form-actions button:hover:not(:disabled){
  transform:translateY(-3px);
  box-shadow:0 6px 20px rgba(110,168,254,0.3);
}
.form-actions button:disabled{
  opacity:0.6;
  cursor:not-allowed;
}
.form-actions span{
  font-size:13px;
  color:var(--muted);
}
.link-btn{
  display:inline-block;
  padding:8px 16px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:8px;
  color:var(--accent);
  text-decoration:none;
  font-size:14px;
  font-weight:600;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.link-btn:hover{
  background:rgba(255,255,255,0.12);
  transform:translateY(-3px);
  box-shadow:0 6px 16px rgba(110,168,254,0.2);
}

/* Light theme button adjustments */
[data-theme="light"] .form-actions button {
  background: linear-gradient(90deg, #1d4ed8, #0ea5e9);
  color: #ffffff;
}

[data-theme="light"] .link-btn {
  background: rgba(15, 23, 36, 0.05);
  border-color: rgba(15, 23, 36, 0.1);
}

[data-theme="light"] .link-btn:hover {
  background: rgba(15, 23, 36, 0.1);
}
</style>

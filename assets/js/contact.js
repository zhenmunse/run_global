// assets/js/contact.js
(function(){
  const qs = (s, r=document) => r.querySelector(s);

  // 仅使用自动渲染的回调来拿 token
  let tsToken = '';

  // 供 Turnstile 自动渲染回调调用（与 data-callback 一致）
  window.onTurnstileVerified = (token) => {
    tsToken = token || '';
  };

  function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function validateQQ(v){ if (!v) return true; return /^[1-9]\d{4,}$/.test(v); }

  async function submitForm(e){
    e.preventDefault();
    const status = qs('#cf-status');
    const btn = qs('#cf-submit');

    const name = qs('#cf-name')?.value.trim() || '';
    const email = qs('#cf-email')?.value.trim() || '';
    const qq = qs('#cf-qq')?.value.trim() || '';
    const message = qs('#cf-message')?.value.trim() || '';
    const honey = qs('#cf-website')?.value.trim() || '';

    if (honey) return;
    if (!name) return status.textContent = '请填写姓名';
    if (!validateEmail(email)) return status.textContent = '请填写有效的邮箱地址';
    if (!validateQQ(qq)) return status.textContent = 'QQ号格式不正确';
    if (!message) return status.textContent = '请填写留言内容';
    if (message.length > 4000) return status.textContent = '内容过长，请精简后再提交';

    // 必须有 token（由 Turnstile 自动渲染回调提供）
    if (!tsToken) {
      status.textContent = '请先完成人机验证';
      return;
    }

    status.textContent = '发送中…';
    btn && (btn.disabled = true);

    const payload = { name, email, qq, message, cf_turnstile_response: tsToken };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(()=>({}));
      if (res.ok) {
        status.textContent = '发送成功，我们会尽快回复。';
        qs('#contactForm')?.reset();
        tsToken = '';
        // 重置小部件以便下次获取新 token（自动渲染可全局 reset）
        try { if (window.turnstile) window.turnstile.reset(); } catch(_) {}
      } else {
        if (res.status === 403) {
          status.textContent = data.message || '验证失败，请重新完成人机验证';
          tsToken = '';
          try { if (window.turnstile) window.turnstile.reset(); } catch(_) {}
        } else {
          status.textContent = data.message || '发送失败，请稍后再试';
        }
      }
    } catch (err) {
      status.textContent = '网络异常，请稍后再试';
    } finally {
      btn && (btn.disabled = false);
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const form = qs('#contactForm');
    if (form) form.addEventListener('submit', submitForm);
  });
})();

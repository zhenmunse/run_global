// assets/js/contact.js
(function(){
  const qs = (s, r=document) => r.querySelector(s);
  let turnstileWidgetId = null;

  async function waitForTurnstile(maxWaitMs = 5000){
    const start = Date.now();
    while (Date.now() - start < maxWaitMs){
      if (window.turnstile && typeof window.turnstile.render === 'function') return true;
      await new Promise(r => setTimeout(r, 100));
    }
    return false;
  }

  function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function validateQQ(v){ if(!v) return true; return /^[1-9]\d{4,}$/.test(v); }

  async function submitForm(e){
    e.preventDefault();
    const status = qs('#cf-status');
    const btn = qs('#cf-submit');

    const name = qs('#cf-name').value.trim();
    const email = qs('#cf-email').value.trim();
    const qq = qs('#cf-qq').value.trim();
    const message = qs('#cf-message').value.trim();
    const honey = qs('#cf-website').value.trim();

    if (honey) return; // 蜜罐命中，静默丢弃
    if (!name) return status.textContent = '请填写姓名';
    if (!validateEmail(email)) return status.textContent = '请填写有效的邮箱地址';
    if (!validateQQ(qq)) return status.textContent = 'QQ号格式不正确';
    if (!message) return status.textContent = '请填写留言内容';
    if (message.length > 4000) return status.textContent = '内容过长，请精简后再提交';

    status.textContent = '发送中…';
    btn.disabled = true;

    // 如果页面配置了 Turnstile (invisible)，先异步获取 token，再提交
    let token = null;
    try {
      const siteKeyEl = document.querySelector('.cf-turnstile[data-sitekey]');
      const sitekey = siteKeyEl && siteKeyEl.getAttribute('data-sitekey');
      if (sitekey){
        // 确保 API 已加载并渲染 widget
        const ok = await waitForTurnstile();
        if (ok) {
          // 首次渲染（如果还没渲染）
          if (!turnstileWidgetId) {
            try {
              turnstileWidgetId = window.turnstile.render(siteKeyEl, {
                sitekey,
                size: 'invisible',
                theme: 'dark',
                action: 'contact_submit'
              });
            } catch(_) { /* ignore */ }
          }
          if (turnstileWidgetId && typeof window.turnstile.execute === 'function') {
            try {
              // 使用 async: true 获取 Promise token
              token = await window.turnstile.execute(turnstileWidgetId, { async: true });
            } catch(_) { token = null; }
          }
        }
      }

      const bodyPayload = { name, email, qq, message };
      if (token) bodyPayload.cf_turnstile_response = token;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json().catch(()=>({}));
      if (res.ok) {
        status.textContent = '发送成功，我们会尽快回复。';
        qs('#contactForm').reset();
      } else {
        status.textContent = data.message || '发送失败，请稍后再试';
      }
    } catch (err) {
      status.textContent = '网络异常，请稍后再试';
      console.error('contact submit err', err);
    } finally {
      btn.disabled = false;
      // 重置 Turnstile，以便下一次提交
      try { if (turnstileWidgetId && window.turnstile && typeof window.turnstile.reset === 'function') window.turnstile.reset(turnstileWidgetId); } catch(_) {}
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const form = qs('#contactForm');
    if (form) form.addEventListener('submit', submitForm);
    // 尝试预渲染（可加速首次提交）
    (async ()=>{
      const el = document.querySelector('.cf-turnstile[data-sitekey]');
      const sitekey = el && el.getAttribute('data-sitekey');
      if (!el || !sitekey) return;
      const ok = await waitForTurnstile();
      if (!ok) return;
      try {
        turnstileWidgetId = window.turnstile.render(el, { sitekey, size: 'invisible', theme: 'dark', action: 'contact_idle' });
      } catch(_) { /* ignore */ }
    })();
  });
})();

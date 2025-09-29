// assets/js/contact.js
(function(){
  const qs = (s, r=document) => r.querySelector(s);

  // state
  let widgetId = null;
  let isExecuting = false;
  let turnstileReady = false;

  // 回调由 Turnstile 调用
  window.onTurnstileVerified = (token) => {
    window.__ts_token = token || '';
    if (window.__ts_resolve) { window.__ts_resolve(token); window.__ts_resolve = null; }
  };

  // 等待 turnstile 脚本加载
  function waitForTurnstile(timeout = 5000) {
    return new Promise((resolve) => {
      if (typeof window.turnstile !== 'undefined') { turnstileReady = true; return resolve(true); }
      const start = Date.now();
      const t = setInterval(() => {
        if (typeof window.turnstile !== 'undefined') { clearInterval(t); turnstileReady = true; return resolve(true); }
        if (Date.now() - start > timeout) { clearInterval(t); return resolve(false); }
      }, 150);
    });
  }

  // render 一次（避免重复 render 导致的错误）
  async function renderTurnstileOnce() {
    const el = qs('#cf-turnstile');
    if (!el) return;
    if (widgetId !== null) return;
    const ok = await waitForTurnstile(7000);
    if (!ok) {
      console.warn('turnstile script 未就绪');
      return;
    }
    try {
      // 合法的 size: "normal" | "compact" | "flexible"
      const sitekey = el.dataset.sitekey || '0x4AAAAAAB3z0RR14y0mYVTp';
      widgetId = window.turnstile.render(el, {
        sitekey,
        callback: 'onTurnstileVerified',
        size: 'compact'
      });
    } catch (e) {
      console.warn('turnstile render failed', e);
      widgetId = null;
    }
  }

  // 获取 token：reset -> execute -> 等待回调
  function getTurnstileToken(timeout = 7000) {
    return new Promise((resolve) => {
      if (!turnstileReady || typeof window.turnstile === 'undefined' || widgetId === null) return resolve(null);
      if (window.__ts_token) { const t = window.__ts_token; return resolve(t); }
      let done = false;
      window.__ts_resolve = (t) => { if (!done) { done = true; resolve(t || null); window.__ts_resolve = null; } };
      try {
        if (isExecuting) { resolve(null); window.__ts_resolve = null; return; }
        isExecuting = true;
        // reset 保证拿到新 token
        try { window.turnstile.reset(widgetId); } catch(e){}
        window.turnstile.execute(widgetId);
      } catch (e) {
        console.warn('turnstile execute failed', e);
        if (!done) { done = true; resolve(null); window.__ts_resolve = null; }
      }
      setTimeout(() => { if (!done) { done = true; resolve(null); window.__ts_resolve = null; isExecuting = false; } }, timeout);
    });
  }

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

    if (honey) return; // 蜜罐命中
    if (!name) return status.textContent = '请填写姓名';
    if (!validateEmail(email)) return status.textContent = '请填写有效的邮箱地址';
    if (!validateQQ(qq)) return status.textContent = 'QQ号格式不正确';
    if (!message) return status.textContent = '请填写留言内容';
    if (message.length > 4000) return status.textContent = '内容过长，请精简后再提交';

    status.textContent = '正在验证…';
    btn.disabled = true;

    // 尝试获取 Turnstile token；若失败给出明确提示（用户侧问题）
    let token = null;
    await renderTurnstileOnce();
    if (turnstileReady && widgetId !== null) {
      token = await getTurnstileToken();
      isExecuting = false;
    }

    if (!token) {
      btn.disabled = false;
      status.textContent = '验证失败（Turnstile 未返回 token）。请尝试隐身模式或检查浏览器扩展/清除 Cookie 后重试。';
      console.warn('Turnstile token 获取失败。turnstileReady=', turnstileReady, 'widgetId=', widgetId, 'window.__ts_token=', window.__ts_token);
      return;
    }

    status.textContent = '发送中…';

    const payload = { name, email, qq, message, cf_turnstile_response: token };

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
        window.__ts_token = '';
        if (typeof window.turnstile !== 'undefined' && widgetId !== null) try { window.turnstile.reset(widgetId); } catch(_) {}
      } else {
        status.textContent = data.message || '发送失败，请稍后再试';
      }
    } catch (err) {
      console.warn('fetch /api/contact 错误', err);
      status.textContent = '网络异常，请稍后再试';
    } finally {
      btn.disabled = false;
    }
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    renderTurnstileOnce();
    const form = qs('#contactForm');
    if (form) form.addEventListener('submit', submitForm);
  });
})();

// assets/js/contact.js
(function(){
  const qs = (s, r=document) => r.querySelector(s);

  // state
  let widgetId = null;
  let turnstileReady = false;
  let tokenPromise = null; // 单一的 token 等待 promise

  // 回调由 Turnstile 调用
  window.onTurnstileVerified = (token) => {
    window.__ts_token = token || '';
    if (window.__ts_resolve) { 
      try { window.__ts_resolve(token); } catch(e){ /* ignore */ }
      window.__ts_resolve = null;
    }
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
      const sitekey = el.dataset.sitekey || '0x4AAAAAAB3z0RR14y0mYVTp';
      widgetId = window.turnstile.render(el, {
        sitekey,
        callback: 'onTurnstileVerified',
        size: 'compact' // 合法值
      });
    } catch (e) {
      console.warn('turnstile render failed', e);
      widgetId = null;
    }
  }

  // 获取 token（单一并发控制、异常重试、清理）
  function getTurnstileToken(timeout = 7000) {
    if (!turnstileReady || typeof window.turnstile === 'undefined' || widgetId === null) return Promise.resolve(null);
    if (window.__ts_token) return Promise.resolve(window.__ts_token);

    if (tokenPromise) return tokenPromise; // 有待定的执行，复用

    tokenPromise = new Promise((resolve) => {
      let settled = false;
      const cleanup = () => {
        tokenPromise = null;
        window.__ts_resolve = null;
        // 不自动清 window.__ts_token，让后续逻辑可读
      };
      window.__ts_resolve = (t) => {
        if (settled) return;
        settled = true;
        resolve(t || null);
        cleanup();
      };

      const doExecute = () => {
        try {
          // reset 确保 execute 会拿到新 token
          try { window.turnstile.reset(widgetId); } catch(e){ /* ignore */ }
          window.turnstile.execute(widgetId);
        } catch (e) {
          console.warn('turnstile execute 抛出异常，重试一次', e);
          // 重试一次（短延迟），若仍失败则 resolve null
          setTimeout(() => {
            try {
              window.turnstile.reset(widgetId);
              window.turnstile.execute(widgetId);
            } catch (e2) {
              if (!settled) { settled = true; resolve(null); cleanup(); }
            }
          }, 250);
        }
      };

      doExecute();

      // 超时保护
      setTimeout(() => {
        if (!settled) { settled = true; resolve(null); cleanup(); }
      }, timeout);
    });

    return tokenPromise;
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

    await renderTurnstileOnce();
    let token = null;
    if (turnstileReady && widgetId !== null) {
      token = await getTurnstileToken();
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

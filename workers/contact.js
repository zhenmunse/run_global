// workers/contact.js
// Cloudflare Worker example that receives POST /api/contact
// - uses KV namespace CONTACT_RATE for simple per-hour rate limiting
// - uses Cloudflare Email Workers (env.MAIL) to send mail to admin@vineshore.org

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }
    if (request.method !== 'POST') {
      return json({ message: 'Method Not Allowed' }, 405, request);
    }

    // 解析与校验
    let ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
    let body;
    try { body = await request.json(); } catch { return json({ message: 'Invalid JSON' }, 400, request); }
    if (body.website) return json({ message: 'Bad Request' }, 400, request); // 蜜罐
    const name = (body.name||'').trim();
    const email = (body.email||'').trim();
    const qq = (body.qq||'').trim();
    const message = (body.message||'').trim();
    const tsToken = (body.cf_turnstile_response||'').trim();
    if (!name || !email || !message) return json({ message: '参数不完整' }, 400, request);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ message: '邮箱无效' }, 400, request);
    if (qq && !/^[1-9]\d{4,}$/.test(qq)) return json({ message: 'QQ号格式不正确' }, 400, request);
    if (message.length > 4000) return json({ message: '内容过长' }, 400, request);

    // Turnstile 校验（如配置）
    if (env.TURNSTILE_SECRET) {
      const ok = await verifyTurnstile(tsToken, request, env.TURNSTILE_SECRET);
      if (!ok) return json({ message: '验证失败，请重试' }, 403, request);
    }

    // 限流（KV，按 IP 每小时）
    try {
      const hashed = await hashIp(ip, env.HASH_SALT || '');
      const key = `ip:${hashed}:${new Date().toISOString().slice(0,13)}`; // 到小时
      const limit = parseInt(env.RATE_LIMIT_PER_HOUR || '5', 10);
      const cur = parseInt((await env.CONTACT_RATE.get(key)) || '0', 10);
      if (cur >= limit) return json({ message: '请求过于频繁，请稍后再试' }, 429, request);
      await env.CONTACT_RATE.put(key, String(cur + 1), { expirationTtl: 3600 });
    } catch (_) {}

    const to = env.CONTACT_TO || 'admin@vineshore.org';
    const from = env.CONTACT_FROM || 'webform@vineshore.org';
    const subject = `网站留言 - ${name}`;
    const now = new Date();
    const lines = [
      `姓名: ${name}`,
      `邮箱: ${email}`,
      qq ? `QQ: ${qq}` : null,
      `IP: ${ip}`,
      `时间: ${now.toISOString()}`,
      '',
      '内容：',
      message
    ].filter(Boolean);
    const textBody = lines.join('\n');
    const htmlBody = lines.map(l => l === '内容：' ? '<strong>内容：</strong>' : l).join('<br>');

    // 通过第三方邮件服务发送（SendGrid 优先；无则尝试 Resend；都无则报错）
    let sent = false, errMsg = '';
    if (env.SENDGRID_API_KEY) {
      const sgPayload = {
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject,
        content: [
          { type: 'text/plain', value: textBody },
          { type: 'text/html', value: htmlBody }
        ]
      };
      const sendgridResp = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sgPayload)
      });

      // 新增：记录 SendGrid 返回的状态与 body（避免丢失信息）
      let sgText = '';
      try { sgText = await sendgridResp.text(); } catch (e) { sgText = '<read error>'; }
      console.log('SENDGRID_FETCH', {
        status: sendgridResp.status,
        ok: sendgridResp.ok,
        body: sgText
      });

      sent = sendgridResp.ok; if (!sendgridResp.ok) errMsg = sgText;
    } else if (env.RESEND_API_KEY) {
      const res = await sendViaResend(env.RESEND_API_KEY, { to, from, subject, text: textBody, html: htmlBody });
      sent = res.ok; if (!res.ok) errMsg = await res.text().catch(()=> 'Resend error');
    } else {
      return json({ message: '服务未配置：请设置 SENDGRID_API_KEY 或 RESEND_API_KEY' }, 500, request);
    }

    if (!sent) return json({ message: '发送失败，请稍后再试', detail: errMsg }, 502, request);
    return json({ message: 'ok' }, 200, request);
  }
}

function corsHeaders(request){
  const h = { 'Access-Control-Allow-Methods':'POST,OPTIONS', 'Access-Control-Allow-Headers':'Content-Type', 'Access-Control-Max-Age':'86400' };
  const origin = request.headers.get('Origin'); if (origin) h['Access-Control-Allow-Origin'] = origin;
  return h;
}
function json(data, status=200, request){
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', ...corsHeaders(request||new Request('')) } });
}
async function verifyTurnstile(token, request, secret){
  if (!token) return false;
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method:'POST', body: form });
  const j = await r.json().catch(()=>({success:false}));
  return !!j.success;
}
async function hashIp(ip, salt){
  const data = new TextEncoder().encode(ip + '|' + salt);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

// 发送实现：SendGrid
async function sendViaSendGrid(apiKey, { to, from, subject, text, html }) {
  return fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html }
      ]
    })
  });
}

// 可选：Resend
async function sendViaResend(apiKey, { to, from, subject, text, html }) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, from, subject, text, html })
  });
}

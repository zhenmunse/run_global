// Cloudflare Worker: studywire-push.js
// 自动/手动转发 studywire/storage 下的 .md 日报到 QQ 群
// 依赖：GitHub Webhook、QQ Bot API、secret 鉴权、自动转发开关

let AUTO_FORWARD = true; // 内存变量，重启后默认开启

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // 1. 开关控制接口（POST /toggle, 需 Authorization: Bearer <TOGGLE_SECRET>）
    if (url.pathname === '/toggle' && request.method === 'POST') {
      if (!checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });
      const { enable } = await request.json().catch(() => ({}));
      if (typeof enable === 'boolean') {
        AUTO_FORWARD = enable;
        return new Response('Auto forward is now ' + (enable ? 'ENABLED' : 'DISABLED'));
      }
      return new Response('Missing enable param', { status: 400 });
    }
    // 2. 手动转发接口（POST /manual, 需 Authorization: Bearer <TOGGLE_SECRET>）
    if (url.pathname === '/manual' && request.method === 'POST') {
      if (!checkAuth(request, env)) return new Response('Unauthorized', { status: 401 });
      const { file } = await request.json().catch(() => ({}));
      if (!file) return new Response('Missing file param', { status: 400 });
      const content = await fetchRawMarkdown(file, env);
      if (!content) return new Response('File not found', { status: 404 });
      const ok = await sendToQQ(content, env);
      return new Response(ok ? 'Sent' : 'Failed', { status: ok ? 200 : 500 });
    }
    // 3. GitHub Webhook 入口（POST /webhook）
    if (url.pathname === '/webhook' && request.method === 'POST') {
      if (!AUTO_FORWARD) return new Response('Auto forward is OFF', { status: 200 });
      const event = request.headers.get('x-github-event');
      if (event !== 'push') return new Response('Not a push event', { status: 200 });
      const body = await request.json();
      const files = [
        ...(body.commits?.flatMap(c => c.added || []) || []),
        ...(body.commits?.flatMap(c => c.modified || []) || [])
      ];
      const mdFiles = files.filter(f => f.startsWith('studywire/storage/') && f.endsWith('.md'));
      let sent = 0;
      for (const file of mdFiles) {
        const content = await fetchRawMarkdown(file, env);
        if (content) {
          const ok = await sendToQQ(content, env);
          if (ok) sent++;
        }
      }
      return new Response('Processed ' + mdFiles.length + ' files, sent ' + sent, { status: 200 });
    }
    // 4. 其他
    return new Response('Not found', { status: 404 });
  }
};

function checkAuth(request, env) {
  const auth = request.headers.get('authorization') || '';
  return auth === 'Bearer ' + env.TOGGLE_SECRET;
}

async function fetchRawMarkdown(file, env) {
  // 生成 GitHub Raw 文件 URL
  const repo = env.GITHUB_REPO || 'zhenmunse/run_global';
  const branch = env.GITHUB_BRANCH || 'main';
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;
  const resp = await fetch(url);
  if (!resp.ok) return null;
  return await resp.text();
}

async function sendToQQ(content, env) {
  // 这里调用 QQ Bot API，需你补充
  // 示例：
  // const resp = await fetch(env.QQ_BOT_API, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + env.QQ_BOT_SECRET },
  //   body: JSON.stringify({ group_id: env.QQ_GROUP_ID, message: content })
  // });
  // return resp.ok;
  return true; // TODO: 实际实现
}

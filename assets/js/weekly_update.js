// assets/js/weekly_update.js
// 提取自 weekly_update/index.html 的内联脚本

// 动态加载脚本，优先本地 vendor，失败回退到多个 CDN
function loadScriptSeq(urls, check, done){
  const tryNext = (i)=>{
    if(i>=urls.length){ done(new Error('All sources failed')); return; }
    const s=document.createElement('script');
    s.src=urls[i]; s.defer=true; s.onload=()=>{ try{ if(!check||check()) return done(); }catch(e){} tryNext(i+1); };
    s.onerror=()=>tryNext(i+1);
    document.head.appendChild(s);
  };
  tryNext(0);
}
function loadStyleSeq(urls, done){
  const tryNext = (i)=>{
    if(i>=urls.length){ done&&done(new Error('All styles failed')); return; }
    const l=document.createElement('link'); l.rel='stylesheet'; l.href=urls[i];
    l.onload=()=>done&&done(); l.onerror=()=>tryNext(i+1);
    document.head.appendChild(l);
  };
  tryNext(0);
}
async function ensureLibsLoaded(){
  return new Promise((resolve)=>{
    loadScriptSeq([
      '/assets/vendor/marked.min.js',
      'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
      'https://unpkg.com/marked/marked.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js'
    ], ()=>window.marked, ()=>{
      loadScriptSeq([
        '/assets/vendor/purify.min.js',
        'https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js',
        'https://unpkg.com/dompurify@2.4.0/dist/purify.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js'
      ], ()=>window.DOMPurify, ()=>{
        loadStyleSeq([
          '/assets/vendor/github.min.css',
          'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/styles/github.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css'
        ]);
        loadScriptSeq([
          '/assets/vendor/highlight.min.js',
          'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/highlight.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js'
        ], ()=>window.hljs, ()=>{ try{ hljs.configure({ignoreUnescapedHTML:true}); }catch(e){} resolve(); });
      });
    });
  });
}

// 标记 marked 的默认解析选项：启用 GFM，并把单个回车视为换行（breaks:true），更贴近 Typora 行为
try {
  if (typeof marked !== 'undefined' && marked && typeof marked.setOptions === 'function') {
    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: false
    });
  }
} catch(e) { /* ignore */ }

// 使用单一渲染器：Marked 页面内渲染
const RENDERERS = [ { name: 'Marked', default: true } ];

// 全局状态
let currentRenderer = RENDERERS.find(r => r.default) || RENDERERS[0];
let currentFile = null;
let availableFiles = [];

// 生成日期列表（最近60天）
function generateDateList() {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0]; // yyyy-mm-dd格式
    dates.push(dateStr);
  }
  
  return dates.sort().reverse(); // 最新的在前
}

// 检查文件是否存在
async function checkFileExists(filename) {
  try {
    const response = await fetch(`storage/${filename}`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// 格式化日期显示
function formatDateDisplay(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `润学周报 - ${year}年${month}月${day}日`;
}

// 扫描可用的文件
async function scanAvailableFiles() {
  const dates = generateDateList();
  const files = [];
  
  for (const date of dates) {
    const filename = `${date}.md`;
    if (await checkFileExists(filename)) {
      files.push({
        date,
        filename,
        display: formatDateDisplay(date)
      });
    }
  }
  
  return files.sort((a, b) => b.date.localeCompare(a.date)); // 最新的在前
}

// 渲染期刊选择下拉框
function renderIssueSelect() {
  const select = document.getElementById('issueSelect');
  if (!select) return;

  if (availableFiles.length === 0) {
    select.innerHTML = '<option value="">暂无可用期刊</option>';
    return;
  }

  select.innerHTML = availableFiles.map(file => 
    `<option value="${file.filename}" ${file === currentFile ? 'selected' : ''}>
          ${file.display}
        </option>`
  ).join('');

  // 添加选择事件
  select.addEventListener('change', (e) => {
    const filename = e.target.value;
    const file = availableFiles.find(f => f.filename === filename);
    if (file) {
      loadFile(file);
    }
  });
}

async function chooseSourceUrl(filename) {
  const rawUrlBase = `https://raw.githubusercontent.com/zhenmunse/run_global/main/weekly_update/storage/${filename}`;
  const cdnUrl = `https://cdn.jsdelivr.net/gh/zhenmunse/run_global@main/weekly_update/storage/${filename}`;

  // 首先试直接请求 raw（不使用缓存）以确保获取最新内容
  try {
    const r = await fetch(rawUrlBase, { method: 'GET', cache: 'no-store' });
    if (r && r.ok) return { type: 'raw', url: rawUrlBase };
  } catch (e) {
    // 忽略，继续尝试 CDN
  }

  // 回退到 CDN（可能返回较旧的缓存版本，但通常较稳定）
  try {
    const r2 = await fetch(cdnUrl, { method: 'HEAD' });
    if (r2 && r2.ok) return { type: 'cdn', url: cdnUrl };
  } catch (e) {
    // 最终回退失败
  }

  return null;
}

// 加载文件并在页面内渲染 Markdown（优先 CDN，回退 RAW）
async function loadFile(file) {
  currentFile = file;

  // 更新标题
  const titleElement = document.getElementById('currentIssueTitle');
  if (titleElement) {
    titleElement.textContent = `📰 ${file.display}`;
  }

  // 更新源码链接（始终指向 raw，以便用户直接打开原始 Markdown）
  const rawLink = document.getElementById('viewRaw');
  if (rawLink) {
    rawLink.href = `https://raw.githubusercontent.com/zhenmunse/run_global/main/weekly_update/storage/${file.filename}`;
  }

  showLoading();
  const contentEl = document.getElementById('issueContent');
  if (!contentEl) {
    hideLoading();
    return;
  }

  // 选择合适的源（cdn/raw）
  const chosen = await chooseSourceUrl(file.filename);

  if (!chosen) {
    hideLoading();
    showError('无法从 CDN 或 RAW 获取文件，请稍后重试');
    return;
  }

  // 现在统一使用页面内 marked 渲染：fetch -> marked -> DOMPurify -> insert -> highlight
  try {
    // 强制为所有来源添加时间戳参数并使用 no-store，最大化避免代理/CDN/浏览器缓存导致的旧内容
    let fetchUrl = chosen.url;
    const sep = fetchUrl.includes('?') ? '&' : '?';
    fetchUrl = `${fetchUrl}${sep}_=${Date.now()}`;
    const fetchOpts = { method: 'GET', cache: 'no-store' };

    const resp = await fetch(fetchUrl, fetchOpts);
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const md = await resp.text();

    // 使用 marked 渲染为 HTML（marked 的全局选项已在顶部设置）
    const rawHtml = (typeof marked !== 'undefined' && marked && typeof marked.parse === 'function') ? marked.parse(md) : `<pre>${md}</pre>`;

    // 使用 DOMPurify 清理 HTML
    const clean = (typeof DOMPurify !== 'undefined' && DOMPurify) ? DOMPurify.sanitize(rawHtml) : rawHtml;

    contentEl.innerHTML = clean;

    // 使用 highlight.js 高亮代码块
    if (typeof hljs !== 'undefined' && hljs) {
      contentEl.querySelectorAll('pre code').forEach((block) => {
        try { hljs.highlightElement(block); } catch (e) { /* ignore */ }
      });
    }

    hideLoading();
  } catch (err) {
    console.error('页面内渲染失败:', err);
    hideLoading();
    showError('页面内渲染失败，请检查控制台');
  }

  // 更新选择框状态
  const select = document.getElementById('issueSelect');
  if (select) {
    select.value = file.filename;
  }
}

// 显示加载状态
function showLoading() {
  const loading = document.getElementById('loadingIndicator');
  if (loading) {
    loading.classList.remove('hidden');
  }
}

// 隐藏加载状态
function hideLoading() {
  const loading = document.getElementById('loadingIndicator');
  if (loading) {
    loading.classList.add('hidden');
  }
}

// 显示错误信息
function showError(message) {
  const loading = document.getElementById('loadingIndicator');
  if (loading) {
    loading.innerHTML = `
          <div style="color: #ff6b6b;">
            <p>❌ ${message}</p>
            <button onclick="location.reload()" style="padding:8px 16px;margin-top:12px;border-radius:6px;border:1px solid #ff6b6b;background:transparent;color:#ff6b6b;cursor:pointer;">
              重新加载
            </button>
          </div>
        `;
  }
}

// 刷新文件列表
async function refreshFileList() {
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.textContent = '🔄 刷新中...';
  }

  try {
    availableFiles = await scanAvailableFiles();
    renderIssueSelect();
    
    // 如果当前没有选中文件，自动选择最新的
    if (!currentFile && availableFiles.length > 0) {
      loadFile(availableFiles[0]);
    }
  } catch (error) {
    console.error('刷新文件列表失败:', error);
    showError('刷新失败，请检查网络连接');
  } finally {
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.textContent = '🔄 刷新列表';
    }
  }
}

// 初始化页面
async function initPage() {
  // 确保渲染依赖（marked/DOMPurify/hljs）已加载
  if (typeof ensureLibsLoaded === 'function') {
    try { await ensureLibsLoaded(); } catch(e) { console.warn('库加载可能不完整，但继续运行'); }
  }

  // 扫描并加载文件列表
  await refreshFileList();
  
  // 绑定刷新按钮
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshFileList);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);

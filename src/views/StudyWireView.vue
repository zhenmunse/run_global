<template>
  <div class="wrap">
    <main>
      <div class="card hero">
        <h2>留学前线</h2>
        <p>每日更新全球留学与移民动态，捕捉最新政策、录取趋势与实用信息。</p>
      </div>
      <div class="card">
        <div class="issue-selector">
          <h3>选择期刊</h3>
          <div class="selector-container">
            <select v-model="currentFile" @change="onFileSelect" class="issue-select">
              <option v-if="availableFiles.length === 0" value="">正在加载期刊列表...</option>
              <option v-for="file in availableFiles" :key="file.filename" :value="file.filename">
                {{ file.display }}
              </option>
            </select>
            <button @click="refreshFileList" :disabled="isRefreshing" class="refresh-btn" title="刷新期刊列表">
              {{ isRefreshing ? '🔄 刷新中...' : '🔄' }}
            </button>
            <button @click="forceRefresh" class="force-refresh-btn" title="强制刷新最新周报">⚡ 强制刷新</button>
          </div>
        </div>

        <div class="current-issue">
          <div class="current-issue-header">
            <h3 id="currentIssueTitle">📰 {{ currentFileDisplay }}</h3>
            <div class="issue-actions">
              <button @click="viewSource" class="view-btn secondary">📄 查看源码</button>
            </div>
          </div>
          <div class="issue-frame-container">
            <div v-if="isLoading" class="loading-indicator">
              <div class="spinner"></div>
              <p>正在加载期刊内容...</p>
            </div>
            <div v-if="error" class="loading-indicator">
               <div style="color: #ff6b6b;">
                <p>❌ {{ error }}</p>
                <button @click="location.reload()" style="padding:8px 16px;margin-top:12px;border-radius:6px;border:1px solid #ff6b6b;background:transparent;color:#ff6b6b;cursor:pointer;">
                  重新加载
                </button>
              </div>
            </div>
            <div v-html="renderedContent" class="issue-content markdown-body"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

// runtime loader for vendor libs in public/assets/vendor
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
      'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
    ], ()=>window.marked, ()=>{
      // Configure marked options after it loads
      try {
        if (window.marked && typeof window.marked.setOptions === 'function') {
          window.marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: false
          });
        }
      } catch(e) { console.warn('Failed to configure marked:', e); }
      
      loadScriptSeq([
        '/assets/vendor/purify.min.js',
        'https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js'
      ], ()=>window.DOMPurify, ()=>{
        loadStyleSeq(['/assets/vendor/github.min.css']);
        loadScriptSeq([
          '/assets/vendor/highlight.min.js',
          'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/highlight.min.js'
        ], ()=>window.hljs, ()=>{ try{ window.hljs && window.hljs.configure && window.hljs.configure({ignoreUnescapedHTML:true}); }catch(e){} resolve(); });
      });
    });
  });
}

const availableFiles = ref([]);
const currentFile = ref(null);
const renderedContent = ref('');
const isLoading = ref(false);
const isRefreshing = ref(false);
const error = ref(null);

const currentFileDisplay = computed(() => {
  const file = availableFiles.value.find(f => f.filename === currentFile.value);
  return file ? file.display : '留学前线';
});

async function viewSource() {
  if (!currentFile.value) return;
  
  try {
    const response = await fetch(`/studywire/storage/${currentFile.value}`);
    const text = await response.text();
    
    // Create a blob with UTF-8 encoding
    const blob = new Blob([text], { type: 'text/markdown; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Open in new tab
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      // Set title after load
      setTimeout(() => {
        try {
          newWindow.document.title = `源码 - ${currentFile.value}`;
        } catch (e) {
          // Ignore cross-origin errors
        }
      }, 100);
    }
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (err) {
    console.error('Failed to load source:', err);
    alert('加载源码失败，请稍后再试');
  }
}

function generateDateList() {
  const dates = [];
  const today = new Date();
  for (let i = 7; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates.sort().reverse();
}

async function checkFileExists(filename) {
  try {
    const response = await fetch(`/studywire/storage/${filename}`, { method: 'HEAD' });
    if (!response.ok) return false;
    
    // Check content-type to ensure it's not HTML (which means Vite returned index.html)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      return false; // Vite returned index.html, file doesn't exist
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

function formatDateDisplay(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `留学前线 - ${year}年${month}月${day}日`;
}

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
  return files.sort((a, b) => b.date.localeCompare(a.date));
}

async function loadFileContent(filename, force = false) {
  if (!filename) return;
  isLoading.value = true;
  error.value = null;
  renderedContent.value = '';

  let url = `/studywire/storage/${filename}`;
  const fetchOptions = { method: 'GET', cache: 'no-store' };
  if (force) {
    url = `https://raw.githubusercontent.com/zhenmunse/run_global/main/studywire/storage/${filename}?t=${Date.now()}`;
  }

  try {
    console.log('Fetching from URL:', url);
    const response = await fetch(url, fetchOptions);
    console.log('Response status:', response.status, 'Content-Type:', response.headers.get('content-type'));
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    
    // Check if Vite returned HTML instead of markdown
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('文件不存在或路径错误（服务器返回了HTML而不是Markdown）');
    }
    
    const md = await response.text();
    console.log('Fetched content length:', md.length, 'First 200 chars:', md.substring(0, 200));
    
    if (!window.marked || typeof window.marked.parse !== 'function') {
      console.error('marked is not loaded properly:', window.marked);
      renderedContent.value = `<pre>${md}</pre>`;
    } else {
      const rawHtml = window.marked.parse(md);
      console.log('Parsed HTML length:', rawHtml.length);
      const clean = (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') ? window.DOMPurify.sanitize(rawHtml) : rawHtml;
      renderedContent.value = clean;
    }

    // highlight
    try {
      if (window.hljs) {
        // defer to next tick to ensure DOM updated
        setTimeout(() => {
          const contentEl = document.querySelector('.issue-content');
          if (contentEl) {
            contentEl.querySelectorAll('pre code').forEach((block) => {
              try { window.hljs.highlightElement(block); } catch (e) { /* ignore */ }
            });
          }
        }, 0);
      }
    } catch (e) { /* ignore */ }
  } catch (err) {
    console.error('Failed to load file content:', err);
    error.value = '无法加载期刊内容，请稍后再试。';
  } finally {
    isLoading.value = false;
  }
}

async function refreshFileList() {
  isRefreshing.value = true;
  try {
    availableFiles.value = await scanAvailableFiles();
    if (availableFiles.value.length > 0 && !currentFile.value) {
      currentFile.value = availableFiles.value[0].filename;
    }
  } catch (err) {
    console.error('Failed to refresh file list:', err);
    error.value = '刷新列表失败。';
  } finally {
    isRefreshing.value = false;
  }
}

function onFileSelect() {
  loadFileContent(currentFile.value);
}

function forceRefresh() {
  if (currentFile.value) {
    loadFileContent(currentFile.value, true);
  }
}

watch(currentFile, (newFile) => {
  if (newFile) {
    loadFileContent(newFile);
  }
});

onMounted(async () => {
  try { await ensureLibsLoaded(); } catch(e) { console.warn('库加载可能不完整，但继续运行'); }
  refreshFileList();
});
</script>

<style scoped>
.wrap{padding-top:72px}
h1{font-size:20px;margin:0}
header p{margin:0;color:var(--muted);font-size:13px}
main{ display:grid; gap:24px; margin-bottom:28px; background:transparent; padding:0; border:0; box-shadow:none; }

.issue-list{
  display:flex;
  flex-direction:column;
  gap:20px;
}
.issue{
  background:var(--glass);
  border:1px solid var(--border);
  border-radius:10px;
  padding:20px;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.issue:hover{
  transform:translateY(-4px);
  background:var(--card);
  box-shadow:0 6px 16px rgba(110,168,254,0.15);
}
.issue-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:12px;
}
.issue-title{
  font-size:18px;
  font-weight:600;
  margin:0;
}
.issue-date{
  color:var(--muted);
  font-size:13px;
}
.issue-summary{
  color:var(--muted);
  line-height:1.6;
  margin-bottom:16px;
}
.issue-link{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:6px 12px;
  border-radius:8px;
  background:linear-gradient(90deg,var(--accent),#7dd3fc);
  color:#04263b;
  text-decoration:none;
  font-weight:600;
  font-size:14px;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.issue-link:hover{
  transform:translateY(-2px);
  box-shadow:0 4px 12px rgba(110,168,254,0.3);
}

.control-panel{
  background:transparent;
  border:0;
  padding:24px 0 8px 0;
  margin-bottom:12px;
  display:grid;
  grid-template-columns:1fr 1fr auto;
  gap:24px;
  align-items:end;
}
.control-panel label{
  display:block;
  font-size:14px;
  font-weight:600;
  color:#e6eef8;
  margin-bottom:8px;
}
.issue-selector{
  display:flex;
  flex-direction:column;
}
.issue-select{
  padding:10px 14px;
  border-radius:8px;
  border:1px solid var(--border);
  background:var(--card);
  color:var(--text-primary);
  font-size:14px;
  font-weight:500;
  min-width:200px;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.issue-select:focus{
  outline:none;
  border-color:var(--accent);
  background:var(--glass);
  box-shadow:0 0 0 3px rgba(110,168,254,0.1);
}
.issue-select option{
  background:var(--card);
  color:var(--text-primary);
  padding:8px;
}


/* current-issue should not have an extra card border when wrapped by outer .card */
.current-issue{ background:transparent; border:0; padding:0; margin-top:12px }

.refresh-btn{
  padding:10px 16px;
  border:1px solid rgba(255,255,255,0.1);
  border-radius:8px;
  background:rgba(255,255,255,0.02);
  color:var(--muted);
  cursor:pointer;
  font-size:14px;
  font-weight:500;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space:nowrap;
}
.refresh-btn:hover{
  background:rgba(255,255,255,0.08);
  border-color:var(--accent);
  color:#e6eef8;
  transform:translateY(-1px);
  box-shadow:0 4px 12px rgba(110,168,254,0.2);
}

.news-item{
  background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.04);
  border-radius:10px;
  padding:20px;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.news-item:hover{
  transform:translateY(-4px);
  background:rgba(255,255,255,0.04);
  border-color:rgba(110,168,254,0.4);
  box-shadow:0 6px 16px rgba(110,168,254,0.15);
}
.news-item-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:12px;
}
.news-item-date{
  font-size:16px;
  font-weight:600;
  margin:0;
}
.news-item-actions{
  display:flex;
  gap:8px;
}
.news-item-btn{
  padding:6px 12px;
  border-radius:6px;
  text-decoration:none;
  font-size:12px;
  font-weight:600;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-view{
  background:linear-gradient(90deg,var(--accent),#7dd3fc);
  color:#04263b;
}
.btn-raw{
  background:rgba(255,255,255,0.05);
  color:var(--muted);
  border:1px solid rgba(255,255,255,0.1);
}
.news-item-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 4px 12px rgba(110,168,254,0.25);
}
.news-item-preview{
  color:var(--muted);
  font-size:14px;
  line-height:1.6;
  margin:0;
  overflow:hidden;
  display:-webkit-box;
  -webkit-line-clamp:3;
  line-clamp:3;
  -webkit-box-orient:vertical;
}

.current-issue{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:12px;
  overflow:hidden;
}
.current-issue-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:20px 24px;
  background:var(--glass);
  border-bottom:1px solid var(--border);
}
.current-issue-header h3{
  margin:0;
  font-size:18px;
  color:var(--text-primary);
}
.issue-actions{
  display:flex;
  gap:12px;
  align-items:center;
}
.view-btn{
  padding:6px 12px;
  border-radius:6px;
  text-decoration:none;
  font-size:12px;
  font-weight:600;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display:inline-flex;
  align-items:center;
  gap:4px;
}
.view-btn.secondary{
  background:rgba(255,255,255,0.05);
  color:var(--muted);
  border:1px solid rgba(255,255,255,0.1);
}
.view-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 4px 12px rgba(110,168,254,0.25);
}

.issue-frame-container{
  position:relative;
  height:75vh;
  min-height:500px;
}
.issue-content{
  width:100%;
  height:100%;
  padding:20px;
  overflow:auto; /* allow scrolling */
  color:var(--muted);
  background:transparent;
}

/* Markdown link styles */
.issue-content a {
  color: var(--accent);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.issue-content a:hover {
  opacity: 0.75;
  text-decoration: underline;
  transform: translateX(2px);
}

.issue-content a:visited {
  color: var(--accent);
}

[data-theme="light"] .issue-content a,
[data-theme="light"] .issue-content a:visited {
  color: #1d4ed8;
}

.loading-indicator{
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  background:rgba(15,23,36,0.9);
  z-index:10;
}
.loading-indicator.hidden{
  display:none;
}
.spinner{
  width:32px;
  height:32px;
  border:3px solid rgba(255,255,255,0.1);
  border-top:3px solid var(--accent);
  border-radius:50%;
  animation:spin 1s linear infinite;
  margin-bottom:12px;
}
.loading-indicator p{
  color:var(--muted);
  margin:0;
  font-size:14px;
}
.issue-frame{
  width:100%;
  height:100%;
  border:none;
  background:#fff;
  border-radius:0 0 12px 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.guide-steps{
  display:flex;
  flex-direction:column;
  gap:16px;
}
.step{
  display:flex;
  gap:16px;
  align-items:flex-start;
}
.step-number{
  width:28px;
  height:28px;
  border-radius:50%;
  background:linear-gradient(135deg,var(--accent),#7dd3fc);
  color:#04263b;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  font-size:14px;
  flex:0 0 28px;
}
.step-content{
  flex:1;
}
.step-content strong{
  display:block;
  margin-bottom:4px;
  color:#e6eef8;
}
.open-renderer-btn{
  padding:6px 12px;
  border-radius:6px;
  text-decoration:none;
  font-size:12px;
  font-weight:600;
  transition:all 0.2s ease;
  display:none;
  background:rgba(255,255,255,0.05);
  color:var(--muted);
  border:1px solid rgba(255,255,255,0.1);
}
.open-renderer-btn.show{ display:inline-flex; }
.step-content p{
  margin:0;
  font-size:14px;
}
.step-content code{
  background:rgba(255,255,255,0.1);
  padding:2px 6px;
  border-radius:4px;
  font-family:monospace;
  font-size:13px;
}

footer{
  text-align:center;
  color:var(--muted);
  font-size:13px;
  margin-top:40px;
}

@media (max-width:880px){
  header{flex-direction:column;align-items:flex-start}
  .nav{
    width:100%;
    justify-content:center;
    margin-top:12px;
  }
  main{padding:20px}
  .weekly-header h2{font-size:24px}
  .control-panel{
    grid-template-columns:1fr;
    gap:16px;
  }
  .current-issue-header{
    flex-direction:column;
    align-items:flex-start;
    gap:12px;
  }
  .issue-actions{
    width:100%;
    justify-content:flex-start;
  }
  .issue-frame-container{
  .open-renderer-btn{
    padding:6px 12px;
    border-radius:6px;
    text-decoration:none;
    font-size:12px;
    font-weight:600;
    transition:all 0.2s ease;
    display:none;
    background:rgba(255,255,255,0.05);
    color:var(--muted);
    border:1px solid rgba(255,255,255,0.1);
  }
  .open-renderer-btn.show{ display:inline-flex; }
    height:60vh;
    min-height:400px;
  }
}
.force-refresh-btn{
  padding:10px 12px;
  border:1px solid rgba(255,255,255,0.08);
  border-radius:8px;
  background:linear-gradient(90deg,var(--accent),#7dd3fc);
  color:#04263b;
  cursor:pointer;
  font-size:14px;
  font-weight:600;
  transition:all 0.18s ease;
  white-space:nowrap;
  margin-left:8px;
}
.force-refresh-btn:hover{ transform:translateY(-1px); }

.markdown-body{ background:transparent; color:var(--text-primary); }
.markdown-body h1,.markdown-body h2,.markdown-body h3{ color:var(--text-primary) }
.markdown-body p{ color:var(--muted); line-height:1.8; margin: 0.6em 0 }
.markdown-body a{ color: var(--accent); text-decoration: underline; }
.markdown-body a:hover{ color:#7dd3fc; text-decoration: none; }
.markdown-body pre{ background:var(--card); padding:12px; border-radius:8px; overflow:auto; border: 1px solid var(--border); }
.markdown-body code{ background:var(--glass); padding:2px 6px; border-radius:6px }
.markdown-body table{ border-collapse:collapse; width:100%; }
.markdown-body th, .markdown-body td{ border:1px solid var(--border); padding:8px }
.markdown-body th{ background: var(--glass); color:var(--text-primary) }
.markdown-body tr:nth-child(even){ background: var(--glass) }
.markdown-body blockquote{ border-left:4px solid var(--border); padding-left:12px; color:var(--muted) }
.markdown-body img{ max-width:100%; height:auto; border-radius:6px }
.markdown-body ul, .markdown-body ol{ padding-left: 1.4em }
.markdown-body li+li{ margin-top: 0.3em }
.markdown-body input[type="checkbox"]{ margin-right:8px; transform: scale(1.05); }
.markdown-body .task-list-item{ list-style: none; }
</style>

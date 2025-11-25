<template>
  <div class="container">
    <div class="card hero">
      <h2>QQ群链接库</h2>
      <p>请收藏此页面，避免失联</p>
    </div>
    
    <div class="notice">
      <p>部分浏览器环境"加入"按钮可能无法正常工作，此时请复制群号手动加群！</p>
    </div>

    <div class="groups">
      <div v-for="group in groups" :key="group.qq" class="group-card">
        <div class="group-title">{{ group.name }}</div>
        <div class="group-info">
          <span class="qq-number">{{ group.qq }}</span>
          <span v-if="group.members" class="member-count">{{ group.members }}</span>
        </div>
        <div class="group-actions">
          <button class="join-btn" @click="joinGroup(group.qq)">
            加入群聊
          </button>
          <button class="copy-btn" @click="copyGroupNumber(group.qq)">
            复制群号
          </button>
        </div>
      </div>
    </div>

    <div id="toast" class="toast" :class="{ show: toast.show }">{{ toast.message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const groups = ref([
  { name: "总群（可能已满）", qq: "2167055144", members: "2000人" },
  { name: "二群", qq: "529282068", members: "2000人" },
  { name: "日语交流群", qq: "1064090273" },
  { name: "美国/加拿大交流群", qq: "769931954" },
  { name: "澳洲/新西兰交流群", qq: "1061445992" },
  { name: "德语交流群", qq: "857225570" },
  { name: "欧陆（除德国）交流群", qq: "912737516" }
]);

const toast = ref({ show: false, message: '' });

function showToast(message) {
  toast.value.message = message;
  toast.value.show = true;
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

function joinGroup(qq) {
  const qqUrl = `tencent://groupwpa/?subcmd=all&param=7C2F2F67726F75702E71712E636F6D2F${qq}2F2F2F`;
  const link = document.createElement('a');
  link.href = qqUrl;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  copyToClipboard(qq).then(success => {
    if (success) {
      showToast(`已尝试打开QQ加群，群号 ${qq} 已复制到剪贴板`);
    } else {
      showToast(`请手动复制群号：${qq}`);
    }
  });
}

function copyGroupNumber(qq) {
  copyToClipboard(qq).then(success => {
    if (success) {
      showToast(`群号 ${qq} 已复制到剪贴板`);
    } else {
      showToast(`复制失败，请手动复制：${qq}`);
    }
  });
}
</script>

<style scoped>
.notice {
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.2);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
  color: #facc15;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.notice::before {
  content: '⚠️';
}

[data-theme="light"] .notice {
  background: rgba(251,191,36,0.1);
  border-color: rgba(251,191,36,0.3);
  color: #d97706;
}

.groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.group-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.group-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: var(--shadow-lg);
}

.group-card:hover::before {
  opacity: 1;
}

.group-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.group-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.qq-number {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 18px;
  color: var(--accent);
  font-weight: 600;
  background: rgba(56, 189, 248, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.member-count {
  color: var(--text-secondary);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.group-actions {
  display: flex;
  gap: 12px;
}

.join-btn, .copy-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.join-btn {
  background: var(--accent-gradient);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.25);
}

.copy-btn {
  background: rgba(255,255,255,0.05);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.join-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4);
}

.copy-btn:hover {
  background: rgba(255,255,255,0.1);
  color: var(--text-primary);
  border-color: var(--text-secondary);
}

.toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  border-radius: 12px;
  padding: 16px 24px;
  color: #e6eef8;
  transform: translateY(100px) scale(0.9);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2000;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(12px);
  font-weight: 500;
}

.toast.show {
  transform: translateY(0) scale(1);
  opacity: 1;
}

@media (max-width: 768px) {
  .groups { grid-template-columns: 1fr; }
  .group-actions { flex-direction: column; }
  .toast { 
    left: 20px; 
    right: 20px; 
    bottom: 20px;
    text-align: center;
  }
}
</style>

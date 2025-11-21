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
  { name: "欧陆（除德国外）交流群", qq: "912737516"}
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
  background: rgba(255, 217, 102, 0.532);
  border: 1px solid rgba(255,193,7,0.4);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
  color: #ffc107;
  backdrop-filter: blur(10px);
}

[data-theme="light"] .notice {
  background: rgba(251,191,36,0.35);
  border-color: rgba(251,191,36,0.7);
  color: #d97706;
}
.groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.group-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: all 0.2s ease;
}
.group-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}
.group-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}
.group-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.qq-number {
  font-family: inherit;
  font-size: 16px;
  color: var(--accent);
  font-weight: 600;
}
.member-count {
  color: var(--muted);
  font-size: 14px;
}
.group-actions {
  display: flex;
  gap: 8px;
}
.join-btn, .copy-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}
.join-btn {
  background: linear-gradient(135deg, var(--accent), #7dd3fc);
  color: #04263b;
}
.copy-btn {
  background: rgba(255,255,255,0.08);
  color: var(--muted);
  border: 1px solid var(--border);
}
.join-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(110,168,254,0.3);
}
.copy-btn:hover {
  background: rgba(255,255,255,0.12);
  color: #e6eef8;
}
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  color: #e6eef8;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}
.toast.show {
  transform: translateY(0);
  opacity: 1;
}
@media (max-width: 768px) {
  .groups { grid-template-columns: 1fr; }
  .group-actions { flex-direction: column; }
}
</style>

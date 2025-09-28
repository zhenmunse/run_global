// assets/js/home.js
// extracted from index.html inline script

// QQ群数据
const groups = [
  {
    name: "总群",
    qq: "2167055144",
    members: "2000人"
  },
  {
    name: "日语交流群",
    qq: "1064090273"
    // members: "人数待更新"
  },
  {
    name: "美国/加拿大交流群",
    qq: "769931954"
    // members: "人数待更新"
  },
  {
    name: "澳洲/新西兰交流群",
    qq: "1061445992"
    // members: "人数待更新"
  },
  {
    name: "德语交流群",
    qq: "857225570"
    // members: "人数待更新"
  }
];

// Toast 提示函数
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 复制到剪贴板
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // 回退方案
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

// 加入QQ群
function joinGroup(qq) {
  // 尝试打开QQ加群链接
  const qqUrl = `tencent://groupwpa/?subcmd=all&param=7C2F2F67726F75702E71712E636F6D2F${qq}2F2F2F`;
  
  // 创建隐藏的链接并点击
  const link = document.createElement('a');
  link.href = qqUrl;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 同时复制群号
  copyToClipboard(qq).then(success => {
    if (success) {
      showToast(`已尝试打开QQ加群，群号 ${qq} 已复制到剪贴板`);
    } else {
      showToast(`请手动复制群号：${qq}`);
    }
  });
}

// 复制群号
function copyGroupNumber(qq) {
  copyToClipboard(qq).then(success => {
    if (success) {
      showToast(`群号 ${qq} 已复制到剪贴板`);
    } else {
      showToast(`复制失败，请手动复制：${qq}`);
    }
  });
}

// 渲染群组列表
function renderGroups() {
  const container = document.querySelector('.groups');

  container.innerHTML = groups.map(group => `
    <div class="group-card">
      <div class="group-title">${group.name}</div>
      <div class="group-info">
        <span class="qq-number">${group.qq}</span>
        ${group.members ? `<span class="member-count">${group.members}</span>` : ``}
      </div>
      <div class="group-actions">
        <button class="join-btn" onclick="joinGroup('${group.qq}')">
          加入群聊
        </button>
        <button class="copy-btn" onclick="copyGroupNumber('${group.qq}')">
          复制群号
        </button>
      </div>
    </div>
  `).join('');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  renderGroups();
});

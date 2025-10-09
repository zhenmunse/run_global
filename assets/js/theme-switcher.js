// Theme switcher functionality
// assets/js/theme-switcher.js

(function() {
  let currentTheme = 'auto';
  
  // 立即执行的主题初始化（防止闪烁）
  function immediateThemeInit() {
    const savedTheme = sessionStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    let themeToApply = 'dark'; // 默认深色
    
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      themeToApply = savedTheme;
      currentTheme = savedTheme;
    } else {
      themeToApply = systemTheme;
      currentTheme = 'auto';
    }
    
    document.documentElement.setAttribute('data-theme', themeToApply);
  }
  
  // 在脚本加载时立即执行（在 DOM 完全加载前）
  immediateThemeInit();
  
  // Get system preference
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme to document
  function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const systemTheme = getSystemTheme();
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    // Update button icon
    updateButtonIcon(theme);
  }
  
  // Update button icon based on current theme
  function updateButtonIcon(theme) {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    
    const actualTheme = theme === 'auto' ? getSystemTheme() : theme;
    
    if (theme === 'auto') {
      button.innerHTML = '🔄'; // Auto mode
      button.title = '主题: 自动';
    } else if (actualTheme === 'dark') {
      button.innerHTML = '☀️'; // Show sun when in dark mode (click to go light)
      button.title = '切换到浅色主题';
    } else {
      button.innerHTML = '🌙'; // Show moon when in light mode (click to go dark)
      button.title = '切换到深色主题';
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    if (currentTheme === 'auto') {
      const systemTheme = getSystemTheme();
      currentTheme = systemTheme === 'dark' ? 'light' : 'dark';
    } else if (currentTheme === 'dark') {
      currentTheme = 'light';
    } else {
      currentTheme = 'dark';
    }
    
    // Store theme in sessionStorage (clears when browser closes)
    sessionStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
  }
  
  // Initialize theme (called after DOM is ready)
  function initTheme() {
    // Theme is already applied by immediateThemeInit, just update button
    applyTheme(currentTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
  }
  
  // Create theme toggle button
  function createThemeButton() {
    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = 'theme-toggle';
    button.addEventListener('click', toggleTheme);
    
    document.body.appendChild(button);
    
    // Update icon after button is created
    updateButtonIcon(currentTheme);
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    createThemeButton();
    initTheme();
  });
})();
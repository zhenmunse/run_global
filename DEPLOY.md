# 部署到 GitHub Pages 指南

## 已完成的配置

✅ **vite.config.js** - 已添加 base 路径 `/run_global/`  
✅ **.github/workflows/deploy.yml** - GitHub Actions 自动部署工作流  
✅ **public/404.html** - SPA 路由 fallback  
✅ **index.html** - 添加路由重定向处理  
✅ **.gitignore** - 忽略 node_modules 和 dist 目录  

## 部署步骤

### 1. 提交并推送代码

```bash
# 查看修改的文件
git status

# 添加所有文件
git add .

# 提交
git commit -m "配置 Vue 项目的 GitHub Pages 部署"

# 推送到 GitHub
git push origin main
```

### 2. 在 GitHub 启用 Pages

1. 访问 https://github.com/zhenmunse/run_global/settings/pages
2. 在 **Source** 下拉框中选择 **GitHub Actions**
3. 保存（如果需要）

### 3. 等待自动部署

- GitHub Actions 会自动触发构建和部署
- 访问 https://github.com/zhenmunse/run_global/actions 查看进度
- 大约 2-5 分钟后完成

### 4. 访问网站

部署成功后，访问：
```
https://zhenmunse.github.io/run_global/
```

## 本地测试

### 构建项目
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 故障排查

### 如果页面显示 404
- 检查 GitHub Pages 是否启用了 **GitHub Actions** 模式
- 检查 Actions 是否成功运行（绿色勾号）

### 如果样式或路径错误
- 确认 `vite.config.js` 中的 `base` 路径为 `/run_global/`
- 重新构建并推送

### 如果 markdown 文件无法加载
- 检查 `public/studywire/storage/` 和 `public/weekly_update/storage/` 目录是否有 .md 文件
- 构建后这些文件应该在 `dist/studywire/storage/` 和 `dist/weekly_update/storage/`

## 更新网站

每次代码修改后：
```bash
git add .
git commit -m "描述你的修改"
git push origin main
```

GitHub Actions 会自动重新构建和部署。

## 注意事项

1. **API 路由**：contact form 的 `/api/contact` 需要配置 Cloudflare Workers
2. **Turnstile Key**：生产环境会自动使用 `0x4AAAAAAB3z0RR14y0mYVTp`
3. **域名配置**：确保 Turnstile 后台已添加 `zhenmunse.github.io` 域名
4. **强制刷新**：StudyWire 和 WeeklyUpdate 的强制刷新功能会从 GitHub raw 拉取最新内容

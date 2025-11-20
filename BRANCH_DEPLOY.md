# 分支部署策略说明

## 📋 概述

已配置两个分支和两种部署方式：

- **main 分支**：原有静态网站
- **vue-test 分支**：Vue 3 重构版本（测试中）

## 🌐 访问地址

### 测试环境（自动部署）
- **URL**: https://home.vineshore.org/vue-test/
- **触发条件**: 推送到 `vue-test` 分支时自动部署
- **用途**: 测试 Vue 版本的新功能和修复

### 生产环境（手动部署）
- **URL**: https://home.vineshore.org/
- **触发条件**: 手动选择要部署的分支
- **用途**: 正式对外服务

## 🚀 部署流程

### 1. 日常开发和测试

在 `vue-test` 分支上开发：

```bash
# 切换到 vue-test 分支
git checkout vue-test

# 进行开发...

# 提交并推送
git add .
git commit -m "你的修改说明"
git push origin vue-test
```

**自动部署到测试环境**:
- GitHub Actions 自动触发构建
- 几分钟后访问 https://home.vineshore.org/vue-test/ 查看效果

### 2. 部署到生产环境

当 Vue 版本测试稳定后：

**步骤 A: 通过 GitHub 网页操作**

1. 访问 https://github.com/zhenmunse/run_global/actions
2. 左侧选择 **"Manual Deploy to Production"**
3. 点击右上角 **"Run workflow"** 下拉按钮
4. 选择分支:
   - `vue-test` - 部署 Vue 版本
   - `main` - 回滚到静态版本
5. 点击 **"Run workflow"** 绿色按钮
6. 等待 2-5 分钟完成部署
7. 访问 https://home.vineshore.org/ 验证

**步骤 B: 通过 GitHub CLI（可选）**

```bash
# 部署 vue-test 到生产
gh workflow run manual-deploy.yml -f branch=vue-test

# 回滚到 main（静态版本）
gh workflow run manual-deploy.yml -f branch=main
```

## 🔄 紧急回滚

如果 Vue 版本出现问题，立即回滚：

1. 访问 https://github.com/zhenmunse/run_global/actions
2. 选择 **"Manual Deploy to Production"**
3. 点击 **"Run workflow"**
4. 选择 `main` 分支
5. 点击运行

几分钟后网站恢复到静态版本。

## 📊 工作流说明

### Deploy Vue Test to GitHub Pages
- **文件**: `.github/workflows/deploy.yml`
- **触发**: 推送到 `vue-test` 分支
- **目标**: https://home.vineshore.org/vue-test/
- **用途**: 自动部署测试环境

### Manual Deploy to Production
- **文件**: `.github/workflows/manual-deploy.yml`
- **触发**: 手动运行
- **目标**: https://home.vineshore.org/
- **用途**: 选择性部署任一分支到生产

## 🛠️ 本地开发

### Vue 版本（vue-test 分支）

```bash
# 切换分支
git checkout vue-test

# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建预览
npm run build
npm run preview
```

### 静态版本（main 分支）

```bash
# 切换分支
git checkout main

# 直接用浏览器打开 index.html 即可
```

## ✅ 合并到 main（最终步骤）

当 Vue 版本完全稳定后，可以合并：

```bash
# 切换到 main
git checkout main

# 合并 vue-test
git merge vue-test

# 推送
git push origin main

# 可选：删除 vue-test 分支
git branch -d vue-test
git push origin --delete vue-test
```

## 📝 注意事项

1. **测试地址**: vue-test 版本的测试地址是 `/vue-test/` 子路径，不是根路径
2. **API 配置**: Turnstile 和 contact API 在两个环境都需要配置
3. **域名**: 确保 Cloudflare 后台配置了 `home.vineshore.org` 和 `zhenmunse.github.io`
4. **缓存**: 部署后可能需要强制刷新浏览器（Ctrl+Shift+R）清除缓存

## 🐛 故障排查

### 测试环境无法访问
- 检查 https://github.com/zhenmunse/run_global/actions 是否成功
- 确认访问的是 `/vue-test/` 路径

### 生产部署失败
- 检查 Actions 运行日志
- 确认选择了正确的分支
- 检查 GitHub Pages 设置（Settings > Pages）

### 样式或路径错误
- 测试环境：base 应该是 `/run_global/vue-test/`
- 生产环境：base 应该是 `/`（根路径）
- 检查 `vite.config.js` 中的 `base` 配置

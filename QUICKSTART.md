# 🚀 快速操作指南

## 测试 Vue 版本

```bash
# 1. 切换到 vue-test 分支
git checkout vue-test

# 2. 本地开发
npm run dev
# 访问 http://localhost:5173

# 3. 提交并推送（自动部署到测试环境）
git add .
git commit -m "你的修改"
git push origin vue-test

# 4. 访问测试环境
# https://home.vineshore.org/vue-test/
```

## 部署到生产环境

### 方式 1: GitHub 网页操作（推荐）

1. 访问: https://github.com/zhenmunse/run_global/actions
2. 点击左侧 "Manual Deploy to Production"
3. 点击 "Run workflow" 按钮
4. 选择分支:
   - **vue-test** - 部署 Vue 版本
   - **main** - 回滚到静态版本
5. 点击绿色 "Run workflow" 按钮
6. 等待 2-5 分钟
7. 访问 https://home.vineshore.org/ 验证

### 方式 2: GitHub CLI

```bash
# 部署 Vue 版本
gh workflow run manual-deploy.yml -f branch=vue-test

# 回滚到静态版本
gh workflow run manual-deploy.yml -f branch=main
```

## 紧急回滚

如果生产环境出问题：

1. https://github.com/zhenmunse/run_global/actions
2. "Manual Deploy to Production"
3. "Run workflow" → 选择 **main** 分支
4. 运行

## 访问地址总览

| 环境 | 地址 | 部署方式 | 分支 |
|------|------|----------|------|
| 🧪 测试 | https://home.vineshore.org/vue-test/ | 自动（推送时） | vue-test |
| 🌐 生产 | https://home.vineshore.org/ | 手动选择 | main 或 vue-test |

## 常用命令

```bash
# 查看当前分支
git branch

# 切换分支
git checkout vue-test   # Vue 测试版
git checkout main       # 静态原版

# 查看部署状态
# 访问: https://github.com/zhenmunse/run_global/actions

# 本地构建测试
npm run build
npm run preview
```

## 完整开发流程示例

```bash
# 1. 开始开发新功能
git checkout vue-test
git pull origin vue-test

# 2. 本地开发和测试
npm run dev
# ... 开发 ...

# 3. 提交到测试环境
git add .
git commit -m "feat: 添加新功能"
git push origin vue-test

# 4. 等待自动部署，访问测试
# https://home.vineshore.org/vue-test/

# 5. 测试通过，部署到生产
# 访问 GitHub Actions 手动运行部署

# 6. 验证生产环境
# https://home.vineshore.org/
```

## ⚠️ 注意事项

- ✅ 测试环境会自动部署（推送 vue-test 分支时）
- ✅ 生产环境需要手动触发（安全考虑）
- ✅ 可以随时在 main 和 vue-test 之间切换
- ⚠️ 部署后可能需要强刷（Ctrl+Shift+R）清缓存

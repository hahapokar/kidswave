# GitHub Pages 部署指南

本文档详细说明如何将 KidsWave 项目部署到 GitHub Pages。

## 前置准备

1. **GitHub 账号**: 确保你有 GitHub 账号
2. **Git 安装**: 确保本地已安装 Git
3. **Node.js**: 确保安装了 Node.js 18 或更高版本

## 部署步骤

### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 创建新仓库，命名为 `kidswave`
3. 不要初始化 README、.gitignore 或 license

### 2. 初始化本地仓库并推送

在项目根目录执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: KidsWave portfolio"

# 添加远程仓库（替换 hahapokar 为你的用户名）
git remote add origin https://github.com/hahapokar/kidswave.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 3. 配置 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 "Build and deployment" 部分：
   - Source: 选择 **GitHub Actions**
   
   ![GitHub Pages Settings](https://docs.github.com/assets/cb-49631/mw-1440/images/help/pages/creating-custom-github-actions-workflow-to-publish-site.webp)

5. 保存设置

### 4. 触发自动部署

配置完成后，GitHub Actions 会自动运行：

1. 查看 **Actions** 标签页
2. 可以看到 "Deploy to GitHub Pages" 工作流正在运行
3. 等待部署完成（通常需要 2-5 分钟）

### 5. 访问网站

部署成功后，你的网站将在以下地址可访问：

```
https://hahapokar.github.io/kidswave/
```

将 `hahapokar` 替换为你的 GitHub 用户名。

## 后续更新

每次推送代码到 main 分支时，GitHub Actions 会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "描述你的修改"
git push
```

## 常见问题

### Q1: 部署后页面显示 404

**解决方案**:
1. 检查 `vite.config.ts` 中的 `base` 配置是否正确：
   ```typescript
   base: '/kidswave/', // 必须匹配你的仓库名
   ```
2. 确保 GitHub Pages 设置中选择了 "GitHub Actions"

### Q2: Actions 权限错误

**解决方案**:
1. 进入仓库 Settings → Actions → General
2. 在 "Workflow permissions" 部分
3. 选择 "Read and write permissions"
4. 勾选 "Allow GitHub Actions to create and approve pull requests"
5. 保存更改

### Q3: 图片无法加载

**解决方案**:
- 确保图片 URL 使用 HTTPS
- 使用 Unsplash 等支持 CORS 的图片源
- 或将图片放在 `public` 目录中使用相对路径

### Q4: 管理员后台跳转 404

**解决方案**:
- 确保 `admin` 文件夹在项目根目录
- 检查 `App.tsx` 中的跳转路径：
  ```typescript
  window.location.href = '/kidswave/admin/';
  ```

## 自定义域名（可选）

如果你有自己的域名：

1. 在仓库根目录创建 `public/CNAME` 文件
2. 内容为你的域名，如：`www.kidswave.com`
3. 在域名服务商处添加 CNAME 记录指向 `hahapokar.github.io`
4. 推送代码，等待 DNS 生效

## 安全建议

⚠️ **重要**: 默认密码仅用于演示！

部署前请修改：

1. **会员密码** (在 `App.tsx` 中)：
   ```typescript
   if (viewerPassword === '8888') // 改为你的密码
   ```

2. **管理员密码** (在 `App.tsx` 中)：
   ```typescript
   if (adminPassword === 'admin666') // 改为你的密码
   ```

## 监控部署状态

- 访问仓库的 **Actions** 标签页
- 查看工作流运行历史
- 点击具体的运行记录查看详细日志

## 回滚到之前版本

如果新版本有问题：

```bash
# 查看提交历史
git log --oneline

# 回滚到指定提交
git revert <commit-hash>
git push
```

## 需要帮助？

- 📖 [GitHub Pages 官方文档](https://docs.github.com/pages)
- 📖 [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- 🐛 [提交 Issue](https://github.com/hahapokar/kidswave/issues)

---

最后更新: 2026-01-26

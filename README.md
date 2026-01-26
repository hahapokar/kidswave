<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KidsWave - 童装设计师作品集

一个现代化的童装设计师作品展示平台，支持密码保护的内容查看和管理员后台。

🌐 **在线访问**: https://hahapokar.github.io/kidswave/

## 功能特性

- 📱 响应式设计，支持移动端和桌面端
- 🔐 三级可见性控制：公开、半公开（密码保护）、专属定制
- 👨‍💼 管理员后台入口（需要密码验证）
- 🎨 支持多个品类：外服、家居服、服饰、花稿
- 💰 价格计算器，支持定制选项
- 🖼️ 水印保护的图片展示
- 🏷️ 按类别和可见性筛选作品

## 本地运行

**前置要求**: Node.js 18+

1. 安装依赖:
   ```bash
   npm install
   ```

2. 启动开发服务器:
   ```bash
   npm run dev
   ```

3. 在浏览器中打开 http://localhost:3000

## 构建部署

构建生产版本:
```bash
npm run build
```

构建产物将在 `dist` 目录中。

## GitHub Pages 部署

本项目配置了自动部署到 GitHub Pages：

1. 确保在 GitHub 仓库设置中启用 GitHub Pages
2. 设置 Pages 源为 "GitHub Actions"
3. 推送代码到 main 分支会自动触发部署

## 密码说明

- **会员查看密码**: `8888` （用于查看半公开作品）
- **管理员密码**: `admin666` （用于进入后台管理）

⚠️ 生产环境请修改这些默认密码！

## 技术栈

- ⚛️ React 19
- 📦 Vite
- 🎨 Tailwind CSS
- 📝 TypeScript
- 🚀 GitHub Actions (自动部署)

## 项目结构

```
kidswear-designer-portfolio/
├── components/          # React 组件
├── services/           # 数据服务和模拟数据
├── admin/             # 管理后台
├── .github/workflows/ # GitHub Actions 配置
└── App.tsx            # 主应用组件
```

## 自定义配置

### 修改部署路径

编辑 [vite.config.ts](vite.config.ts) 中的 `base` 配置：

```typescript
export default defineConfig({
  base: '/kidswave/', // 修改为你的仓库名
  // ...
})
```

### 添加新作品

编辑 [services/mockData.ts](services/mockData.ts) 添加新的作品项。

## License

© 2026 KIDSWAVE. All Rights Reserved.


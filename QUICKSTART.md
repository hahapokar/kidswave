# 🌊 KidsWave - 快速开始指南

欢迎使用 KidsWave 童装设计师作品集平台！

## 🚀 5分钟快速部署

### 方法一: 使用自动化脚本（推荐）

```bash
# 1. 赋予脚本执行权限
chmod +x deploy-init.sh

# 2. 运行初始化脚本
./deploy-init.sh

# 3. 按照提示输入你的 GitHub 信息
# 4. 在 GitHub 上创建对应的仓库
# 5. 推送代码
git push -u origin main
```

### 方法二: 手动部署

```bash
# 1. 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 2. 创建 GitHub 仓库后，添加远程地址
git remote add origin https://github.com/你的用户名/kidswave.git
git branch -M main
git push -u origin main

# 3. 在 GitHub 仓库设置中启用 GitHub Pages
#    Settings → Pages → Source 选择 "GitHub Actions"
```

## 🔑 默认密码

⚠️ **重要提醒**: 部署前请修改这些密码！

- **会员查看密码**: `8888`
- **管理员密码**: `admin666`

修改位置: [App.tsx](App.tsx) 文件中搜索这两个密码

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问 http://localhost:3000
```

## 📦 添加新作品

编辑 [services/mockData.ts](services/mockData.ts) 文件：

```typescript
{
  id: '17',
  title: '你的作品标题',
  coverImage: 'https://images.unsplash.com/photo-xxx',
  category: Category.OUTERWEAR, // 外服/家居服/服饰/花稿
  ageGroup: AgeGroup.KIDS,      // 婴童/小中童
  visibility: Visibility.PUBLIC, // 公开/半公开/专属定制
  basePrice: 599,
  description: '作品描述...',
  addons: [
    { label: '工艺版单 (B)', price: 100 }
  ]
}
```

## 🎨 修改品牌信息

在 [App.tsx](App.tsx) 中搜索以下内容并修改：

- **品牌名称**: 搜索 "KIDSWAVE"
- **联系邮箱**: 搜索 "design@kidswave.studio"
- **地址**: 搜索 "杭州市滨江区"

## 📊 数据说明

目前项目包含了 16 个示例作品，涵盖：

- **外服**: 8个作品
- **家居服**: 3个作品
- **服饰**: 2个作品
- **花稿**: 3个作品

所有图片使用 Unsplash 免费图库，可以替换为你自己的设计作品。

## 🖼️ 使用自己的图片

### 选项1: 使用图床服务

推荐使用：
- [Imgur](https://imgur.com/) - 免费图床
- [Cloudinary](https://cloudinary.com/) - 专业图片CDN
- [Unsplash](https://unsplash.com/) - 免费高质量图片

### 选项2: 存放在仓库中

```bash
# 1. 创建 public/images 目录
mkdir -p public/images

# 2. 将图片放入该目录
# 3. 在 mockData.ts 中使用相对路径
coverImage: '/kidswave/images/your-image.jpg'
```

注意：GitHub 有 100MB 单文件限制，建议使用图床服务。

## 🔧 常见配置

### 修改部署路径

如果仓库名不是 `kidswave`，需要修改 [vite.config.ts](vite.config.ts):

```typescript
export default defineConfig({
  base: '/你的仓库名/', // 这里修改
  // ...
})
```

同时修改 [App.tsx](App.tsx) 中的管理员跳转路径：

```typescript
window.location.href = '/你的仓库名/admin/';
```

### 修改筛选类别

编辑 [types.ts](types.ts) 文件：

```typescript
export enum Category {
  OUTERWEAR = '外服',
  LOUNGEWEAR = '家居服',
  ACCESSORIES = '服饰',
  PATTERNS = '花稿',
  // 添加新类别
  NEWCATEGORY = '新类别'
}
```

## 📱 响应式设计

项目已针对以下设备优化：
- 📱 移动设备 (320px - 767px)
- 📱 平板设备 (768px - 1023px)
- 💻 桌面设备 (1024px+)

## 🆘 需要帮助？

- 📖 查看完整文档: [DEPLOYMENT.md](DEPLOYMENT.md)
- 📖 项目说明: [README.md](README.md)
- 🐛 遇到问题？搜索或提交 [GitHub Issue](https://github.com/hahapokar/kidswave/issues)

## 🎯 部署检查清单

部署前请确认：

- [ ] 已修改默认密码
- [ ] 已更新品牌信息（名称、邮箱、地址）
- [ ] 已添加自己的作品数据
- [ ] 已替换或使用合适的图片
- [ ] 已测试本地运行 `npm run dev`
- [ ] 已测试构建 `npm run build`
- [ ] vite.config.ts 中的 base 路径正确
- [ ] 已在 GitHub 创建对应的仓库
- [ ] 已在 GitHub Pages 设置中选择 "GitHub Actions"

## 📈 下一步

部署成功后，你可以：

1. 🎨 自定义颜色主题和样式
2. 📧 集成真实的联系表单
3. 🔐 使用真实的身份认证系统
4. 💳 集成支付系统
5. 📊 添加数据分析（Google Analytics）
6. 🌍 添加多语言支持

## 🎉 享受创作！

祝你使用愉快！如果这个项目对你有帮助，别忘了给个 ⭐️！

---

更新时间: 2026-01-26

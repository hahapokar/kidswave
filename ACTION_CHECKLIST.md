# 操作清单 / Action Checklist

## ✅ 已完成 / Completed

- [x] 用户注册和登录功能 (UserAuth.tsx)
- [x] 用户专属内容面板 (UserDashboard.tsx)
- [x] 半公开图片密码验证 (ImagePasswordPrompt.tsx)
- [x] 管理员后台密码和用户分配字段
- [x] App.tsx 完整集成认证流程
- [x] 类型定义更新 (User, PortfolioItem 扩展)
- [x] Cloudflare 部署配置文档
- [x] 用户认证系统使用指南

---

## 🎯 现在你需要做的 / What You Need to Do Now

### 1️⃣ 测试本地功能 (5-10 分钟)

访问开发服务器测试所有功能:

**网址**: http://localhost:3000/kidswave/

#### 测试步骤:

**A. 测试用户注册**
```
1. 点击右上角 "用户登录"
2. 切换到 "注册" 标签
3. 填写:
   - 邮箱: your@email.com
   - 手机: 13800138000
   - 微信: your_wechat
   - 姓名: 你的名字
   - 密码: 任意密码
4. 点击 "注册" → 应该成功并显示专属面板
```

**B. 测试管理员后台**
```
1. 滚动到页面底部
2. 点击灰色小字 "[管理者入口]"
3. 输入密码: wlj666
4. 进入后台，点击 "添加新作品"
5. 测试两种场景:
   
   场景1 - 半公开内容:
   - 标题: 测试半公开作品
   - 级别: SEMI_PUBLIC
   - 设置密码: abc123  ← 必须填写
   - 点击保存
   
   场景2 - 专属内容:
   - 标题: 测试专属作品
   - 级别: EXCLUSIVE
   - 分配用户: your@email.com  ← 填写你刚才注册的邮箱
   - 点击保存
```

**C. 测试半公开访问**
```
1. 退出管理员 (点击右上角 "退出")
2. 点击刚才创建的 "测试半公开作品"
3. 应弹出密码输入框
4. 输入: abc123
5. 应该成功查看详情
```

**D. 测试专属内容**
```
1. 以刚才注册的用户登录
2. 应该自动进入专属面板
3. 应该看到 "测试专属作品" 出现在列表中
4. 点击查看详情
```

---

### 2️⃣ 准备 Cloudflare 部署 (30-60 分钟)

**如果你想让用户能真正注册和登录，需要部署到 Cloudflare**

#### 前置要求:
- [ ] Cloudflare 账户 (免费即可)
- [ ] Node.js 18+ 已安装
- [ ] Git 已安装

#### 操作步骤:

**Step 1: 安装 Wrangler CLI**
```bash
npm install -g wrangler
wrangler login  # 会打开浏览器登录 Cloudflare
```

**Step 2: 创建 D1 数据库**
```bash
cd /Users/patrick/Downloads/kidswear-designer-portfolio
wrangler d1 create kidswave-db
```
→ 记录返回的 `database_id`

**Step 3: 创建 R2 存储桶**
```bash
wrangler r2 bucket create kidswave-images
```

**Step 4: 创建 Workers 项目**
```bash
mkdir kidswave-api
cd kidswave-api
npm init -y
npm install itty-router bcryptjs @tsndr/cloudflare-worker-jwt
```

**Step 5: 复制代码**
- 从 `CLOUDFLARE_SETUP.md` 复制:
  - `schema.sql` → 创建数据库表
  - `src/index.js` → Worker API 代码
  - `wrangler.toml` → 配置文件 (记得替换 database_id)

**Step 6: 部署**
```bash
# 初始化数据库
wrangler d1 execute kidswave-db --file=./schema.sql

# 部署 Worker
wrangler deploy
```

**Step 7: 修改前端代码**
- 从 `CLOUDFLARE_SETUP.md` 复制 `src/services/api.ts`
- 替换 API_BASE 为你的 Worker URL
- 修改组件使用 API (详见文档)

**详细步骤请查看**: `CLOUDFLARE_SETUP.md`

---

### 3️⃣ 可选优化 (时间充裕时)

#### A. 添加忘记密码功能
- 需要邮件服务 (可用 Cloudflare Email Routing)
- 生成重置 Token
- 发送重置链接

#### B. 添加邮箱验证
- 注册时发送验证邮件
- 验证后才能访问专属内容

#### C. 用户权限细化
- VIP 用户 (访问所有半公开内容)
- 普通用户 (仅访问分配内容)
- 访客 (仅公开内容)

#### D. 图片水印增强
- 为未付费用户显示明显水印
- 付费用户下载无水印版本

---

## 📁 文件说明 / File Guide

### 核心代码文件
| 文件 | 说明 |
|------|------|
| `App.tsx` | 主应用, 已集成认证流程 |
| `types.ts` | 类型定义, 包含 User 和扩展的 PortfolioItem |
| `components/UserAuth.tsx` | 用户注册/登录组件 |
| `components/UserDashboard.tsx` | 用户专属内容面板 |
| `components/ImagePasswordPrompt.tsx` | 半公开图片密码验证 |
| `components/AdminPanel.tsx` | 管理员后台 (已增强) |

### 文档文件
| 文件 | 说明 |
|------|------|
| `CLOUDFLARE_SETUP.md` | **📘 Cloudflare 部署完整指南** |
| `AUTHENTICATION_GUIDE.md` | 用户认证系统详细说明 |
| `README.md` | 项目基本介绍 |

---

## 🐛 常见问题 / FAQ

### Q1: 用户注册后刷新页面就丢失了？
**A**: 这是正常的，因为当前使用 localStorage。部署到 Cloudflare 后会使用真实数据库持久化。

### Q2: 如何查看已注册的用户？
**A**: 打开浏览器开发者工具 (F12) → Application → Local Storage → `users`

### Q3: 忘记管理员密码怎么办？
**A**: 管理员密码硬编码为 `wlj666`，如需修改请编辑 `App.tsx` 第 89 行。

### Q4: 如何清空所有数据重新测试？
**A**: 
```javascript
// 在浏览器控制台运行:
localStorage.clear();
location.reload();
```

### Q5: 半公开作品的密码忘了？
**A**: 
1. 进入管理员后台
2. 找到该作品点击 "编辑"
3. 查看/修改密码字段

### Q6: 专属内容分配了用户但看不到？
**A**: 检查:
1. 用户邮箱拼写是否正确
2. 用户是否已登录
3. 浏览器控制台是否有错误

---

## 📞 获取帮助 / Get Help

如果遇到问题:

1. **检查浏览器控制台** (F12 → Console)
   - 查看是否有红色错误信息

2. **检查 localStorage 数据**
   - F12 → Application → Local Storage
   - 确认 `users` 和 `portfolioItems` 数据格式正确

3. **重新阅读文档**
   - `AUTHENTICATION_GUIDE.md` - 系统说明
   - `CLOUDFLARE_SETUP.md` - 部署指南

4. **重新启动开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   npm run dev
   ```

---

## 🎉 总结 / Summary

**你现在拥有一个完整的三级访问控制系统:**

1. **公开内容** - 所有人可访问
2. **半公开内容** - 需要单个图片密码
3. **专属内容** - 需要用户登录 + 管理员分配

**立即行动:**
1. ✅ 测试本地功能 (5分钟)
2. ✅ 阅读 `CLOUDFLARE_SETUP.md` (10分钟)
3. ✅ 部署到 Cloudflare (30分钟)
4. ✅ 分享给客户使用! 🚀

**祝你成功! 如有问题随时联系。** 💪

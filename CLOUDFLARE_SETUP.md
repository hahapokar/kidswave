# Cloudflare 部署配置指南 / Cloudflare Setup Guide

本文档提供将 KIDSWAVE 作品集从本地 localStorage 迁移到 Cloudflare 云端的完整配置指南。

---

## 📋 目录 / Table of Contents

1. [系统架构概览](#系统架构概览)
2. [Cloudflare 服务选择](#cloudflare-服务选择)
3. [D1 数据库设置](#d1-数据库设置)
4. [R2 存储桶配置](#r2-存储桶配置)
5. [Workers API 开发](#workers-api-开发)
6. [前端代码修改](#前端代码修改)
7. [部署流程](#部署流程)
8. [安全性建议](#安全性建议)

---

## 🏗️ 系统架构概览

### 当前状态 (localStorage)
```
浏览器 localStorage
├── portfolioItems (作品数据)
└── users (用户数据)
```

### 目标架构 (Cloudflare)
```
Cloudflare Pages (前端静态托管)
    ↓
Cloudflare Workers (API 端点)
    ↓
Cloudflare D1 (SQL 数据库 - 用户/作品元数据)
    ↓
Cloudflare R2 (对象存储 - 图片文件)
```

---

## ☁️ Cloudflare 服务选择

### 推荐方案
| 服务 | 用途 | 免费额度 |
|------|------|---------|
| **Pages** | 托管 React 应用 | 无限请求 |
| **Workers** | API 后端逻辑 | 100k 请求/天 |
| **D1** | 存储用户/作品数据 | 100k 读/天, 1k 写/天 |
| **R2** | 存储图片文件 | 10 GB 存储 |

### 成本估算
- 免费套餐足够支持 **1000+ 日活用户**
- 超出后按量付费：D1 约 $0.001/1000 次读取

---

## 🗄️ D1 数据库设置

### 1. 创建数据库

在 Cloudflare Dashboard:
```bash
# 或使用 Wrangler CLI
wrangler d1 create kidswave-db
```

记录返回的 `database_id`

### 2. 数据库表结构

创建 `schema.sql`:

```sql
-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  wechat TEXT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,  -- 使用 bcrypt 加密
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- 作品表
CREATE TABLE portfolio_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  visibility TEXT NOT NULL,
  age_group TEXT,
  base_price REAL,
  cover_image TEXT NOT NULL,  -- R2 URL
  additional_images TEXT,     -- JSON 数组
  blur_percentage INTEGER DEFAULT 0,
  password_hash TEXT,         -- 半公开作品密码 (bcrypt)
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- 用户-作品关联表 (专属内容分配)
CREATE TABLE user_item_assignments (
  user_email TEXT NOT NULL,
  item_id TEXT NOT NULL,
  assigned_at INTEGER NOT NULL,
  PRIMARY KEY (user_email, item_id),
  FOREIGN KEY (user_email) REFERENCES users(email),
  FOREIGN KEY (item_id) REFERENCES portfolio_items(id)
);

-- 索引优化
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_items_visibility ON portfolio_items(visibility);
CREATE INDEX idx_assignments_user ON user_item_assignments(user_email);
CREATE INDEX idx_assignments_item ON user_item_assignments(item_id);
```

### 3. 执行迁移

```bash
wrangler d1 execute kidswave-db --file=./schema.sql
```

---

## 📦 R2 存储桶配置

### 1. 创建存储桶

```bash
wrangler r2 bucket create kidswave-images
```

### 2. 配置 CORS (允许前端访问)

创建 `cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "https://yourusername.github.io",
        "http://localhost:3000"
      ],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

应用配置:
```bash
wrangler r2 bucket cors put kidswave-images --file=cors.json
```

### 3. 上传现有图片

```bash
# 批量上传本地图片到 R2
wrangler r2 object put kidswave-images/covers/image1.jpg --file=./public/images/image1.jpg
```

---

## ⚙️ Workers API 开发

### 1. 创建 Workers 项目

```bash
npm create cloudflare@latest kidswave-api -- --framework=none
cd kidswave-api
```

### 2. 配置 `wrangler.toml`

```toml
name = "kidswave-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

# 绑定 D1 数据库
[[d1_databases]]
binding = "DB"
database_name = "kidswave-db"
database_id = "YOUR_DATABASE_ID"  # 替换为实际 ID

# 绑定 R2 存储桶
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "kidswave-images"

# 环境变量
[vars]
JWT_SECRET = "YOUR_JWT_SECRET"  # 生成随机密钥
ADMIN_PASSWORD_HASH = "$2b$10$..."  # bcrypt 哈希后的 'wlj666'
```

### 3. API 端点实现

创建 `src/index.js`:

```javascript
import { Router } from 'itty-router';
import bcrypt from 'bcryptjs';
import jwt from '@tsndr/cloudflare-worker-jwt';

const router = Router();

// CORS 中间件
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

router.options('*', () => new Response(null, { headers: corsHeaders }));

// ==================== 用户认证 ====================

// 用户注册
router.post('/api/register', async (request, env) => {
  const { email, phone, wechat, name, password } = await request.json();
  
  // 验证输入
  if (!email || !name || !password) {
    return new Response(JSON.stringify({ error: '缺少必填字段' }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 检查邮箱是否已存在
  const existing = await env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();

  if (existing) {
    return new Response(JSON.stringify({ error: '邮箱已被注册' }), { 
      status: 409, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 哈希密码
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();
  const now = Date.now();

  // 插入用户
  await env.DB.prepare(`
    INSERT INTO users (id, email, phone, wechat, name, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(userId, email, phone, wechat, name, passwordHash, now).run();

  // 生成 JWT
  const token = await jwt.sign({
    id: userId,
    email,
    name,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30天
  }, env.JWT_SECRET);

  return new Response(JSON.stringify({ 
    token,
    user: { id: userId, email, phone, wechat, name }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// 用户登录
router.post('/api/login', async (request, env) => {
  const { email, password } = await request.json();

  const user = await env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first();

  if (!user) {
    return new Response(JSON.stringify({ error: '用户不存在' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return new Response(JSON.stringify({ error: '密码错误' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const token = await jwt.sign({
    id: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
  }, env.JWT_SECRET);

  return new Response(JSON.stringify({ 
    token,
    user: { 
      id: user.id, 
      email: user.email, 
      phone: user.phone,
      wechat: user.wechat,
      name: user.name 
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// ==================== 作品管理 ====================

// 获取公开/半公开作品列表
router.get('/api/portfolio', async (request, env) => {
  const url = new URL(request.url);
  const visibility = url.searchParams.get('visibility') || 'PUBLIC';

  const { results } = await env.DB.prepare(
    'SELECT * FROM portfolio_items WHERE visibility IN (?, ?)'
  ).bind('PUBLIC', 'SEMI_PUBLIC').all();

  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// 获取用户专属作品
router.get('/api/portfolio/exclusive', async (request, env) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: '未授权' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = await jwt.verify(token, env.JWT_SECRET);
  
  if (!decoded) {
    return new Response(JSON.stringify({ error: 'Token 无效' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 获取该用户被分配的专属作品
  const { results } = await env.DB.prepare(`
    SELECT p.* FROM portfolio_items p
    INNER JOIN user_item_assignments a ON p.id = a.item_id
    WHERE a.user_email = ? AND p.visibility = 'EXCLUSIVE'
  `).bind(decoded.email).all();

  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// 验证半公开作品密码
router.post('/api/portfolio/:id/verify', async (request, env) => {
  const { id } = request.params;
  const { password } = await request.json();

  const item = await env.DB.prepare(
    'SELECT password_hash FROM portfolio_items WHERE id = ?'
  ).bind(id).first();

  if (!item || !item.password_hash) {
    return new Response(JSON.stringify({ error: '作品不存在或无需密码' }), { 
      status: 404, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const valid = await bcrypt.compare(password, item.password_hash);

  return new Response(JSON.stringify({ valid }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// ==================== 管理员接口 ====================

// 中间件：验证管理员
async function verifyAdmin(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return false;

  const password = authHeader.replace('Bearer ', '');
  return await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
}

// 管理员：创建/更新作品
router.post('/api/admin/portfolio', async (request, env) => {
  if (!await verifyAdmin(request, env)) {
    return new Response(JSON.stringify({ error: '权限不足' }), { 
      status: 403, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const data = await request.json();
  const itemId = data.id || crypto.randomUUID();
  const now = Date.now();

  // 如果是半公开作品，哈希密码
  let passwordHash = null;
  if (data.visibility === 'SEMI_PUBLIC' && data.password) {
    passwordHash = await bcrypt.hash(data.password, 10);
  }

  await env.DB.prepare(`
    INSERT OR REPLACE INTO portfolio_items 
    (id, title, description, category, visibility, age_group, base_price, 
     cover_image, blur_percentage, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    itemId, data.title, data.description, data.category, data.visibility,
    data.ageGroup, data.basePrice, data.coverImage, data.blurPercentage,
    passwordHash, now, now
  ).run();

  // 处理用户分配 (如果是专属作品)
  if (data.visibility === 'EXCLUSIVE' && data.assignedUsers?.length > 0) {
    // 先删除旧的分配
    await env.DB.prepare('DELETE FROM user_item_assignments WHERE item_id = ?')
      .bind(itemId).run();

    // 插入新分配
    for (const email of data.assignedUsers) {
      await env.DB.prepare(`
        INSERT INTO user_item_assignments (user_email, item_id, assigned_at)
        VALUES (?, ?, ?)
      `).bind(email, itemId, now).run();
    }
  }

  return new Response(JSON.stringify({ success: true, id: itemId }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// 管理员：上传图片到 R2
router.post('/api/admin/upload', async (request, env) => {
  if (!await verifyAdmin(request, env)) {
    return new Response(JSON.stringify({ error: '权限不足' }), { 
      status: 403, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  
  if (!file) {
    return new Response(JSON.stringify({ error: '未提供文件' }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const filename = `${Date.now()}-${file.name}`;
  const key = `uploads/${filename}`;

  await env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type }
  });

  // 生成公开访问 URL
  const url = `https://YOUR_R2_DOMAIN/${key}`;  // 配置自定义域名

  return new Response(JSON.stringify({ url }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// 默认路由
router.all('*', () => new Response('Not Found', { status: 404 }));

// Worker 入口
export default {
  fetch: router.handle
};
```

### 4. 安装依赖

```bash
npm install itty-router bcryptjs @tsndr/cloudflare-worker-jwt
```

### 5. 生成管理员密码哈希

```javascript
// 在本地运行
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('wlj666', 10);
console.log(hash);  // 复制到 wrangler.toml 的 ADMIN_PASSWORD_HASH
```

---

## 🔧 前端代码修改

### 1. 创建 API 客户端

创建 `src/services/api.ts`:

```typescript
const API_BASE = 'https://kidswave-api.YOUR_SUBDOMAIN.workers.dev';

// 用户注册
export async function registerUser(data: {
  email: string;
  phone: string;
  wechat: string;
  name: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error);
  }
  
  const { token, user } = await res.json();
  localStorage.setItem('authToken', token);
  return user;
}

// 用户登录
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error);
  }
  
  const { token, user } = await res.json();
  localStorage.setItem('authToken', token);
  return user;
}

// 获取作品列表
export async function getPortfolioItems(visibility: 'PUBLIC' | 'SEMI_PUBLIC' = 'PUBLIC') {
  const res = await fetch(`${API_BASE}/api/portfolio?visibility=${visibility}`);
  return res.json();
}

// 获取专属作品
export async function getExclusiveItems() {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}/api/portfolio/exclusive`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

// 验证半公开作品密码
export async function verifyItemPassword(itemId: string, password: string) {
  const res = await fetch(`${API_BASE}/api/portfolio/${itemId}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const { valid } = await res.json();
  return valid;
}

// 管理员：上传图片
export async function uploadImage(file: File, adminPassword: string) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminPassword}` },
    body: formData
  });
  
  const { url } = await res.json();
  return url;
}

// 管理员：创建/更新作品
export async function savePortfolioItem(data: any, adminPassword: string) {
  const res = await fetch(`${API_BASE}/api/admin/portfolio`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminPassword}` 
    },
    body: JSON.stringify(data)
  });
  
  return res.json();
}
```

### 2. 修改组件使用 API

在 `UserAuth.tsx` 中:

```typescript
import { loginUser, registerUser } from '../services/api';

// 替换现有的 handleLogin 和 handleRegister 函数
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const user = await loginUser(formData.email, formData.password);
    onLoginSuccess(user);
  } catch (error) {
    alert(error.message);
  }
};

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const user = await registerUser(formData);
    onLoginSuccess(user);
  } catch (error) {
    alert(error.message);
  }
};
```

在 `App.tsx` 中加载作品:

```typescript
import { getPortfolioItems, getExclusiveItems } from './services/api';

useEffect(() => {
  async function loadPortfolio() {
    const items = await getPortfolioItems('SEMI_PUBLIC');
    setPortfolioItems(items);
  }
  loadPortfolio();
}, []);

// 用户登录后加载专属内容
useEffect(() => {
  if (currentUser) {
    async function loadExclusive() {
      const exclusiveItems = await getExclusiveItems();
      // 合并到 portfolioItems
      setPortfolioItems(prev => [...prev, ...exclusiveItems]);
    }
    loadExclusive();
  }
}, [currentUser]);
```

---

## 🚀 部署流程

### 1. 部署 Workers API

```bash
cd kidswave-api
wrangler deploy
```

记录生成的 URL: `https://kidswave-api.YOUR_SUBDOMAIN.workers.dev`

### 2. 配置自定义域名 (可选)

在 Cloudflare Dashboard → Workers → Custom Domains:
- 添加 `api.kidswave.com` 指向你的 Worker

### 3. 部署前端到 Pages

在项目根目录:

```bash
# 构建生产版本
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name=kidswave
```

### 4. 迁移现有数据

创建 `migrate-data.js`:

```javascript
const localItems = JSON.parse(localStorage.getItem('portfolioItems') || '[]');
const localUsers = JSON.parse(localStorage.getItem('users') || '[]');

// 上传每个作品到 API
for (const item of localItems) {
  await fetch('https://kidswave-api.YOUR_SUBDOMAIN.workers.dev/api/admin/portfolio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer wlj666'
    },
    body: JSON.stringify(item)
  });
}

console.log('迁移完成！');
```

在浏览器控制台运行此脚本。

---

## 🔒 安全性建议

### 1. 密码加密
- ✅ 所有密码使用 bcrypt 哈希 (成本因子 10+)
- ❌ 永远不要存储明文密码

### 2. JWT 配置
- 设置合理过期时间 (30 天)
- 使用强随机密钥 (32+ 字符)
- 在 `wrangler.toml` 中使用环境变量:

```toml
[vars]
JWT_SECRET = "YOUR_RANDOM_32_CHARACTER_SECRET_HERE"
```

### 3. CORS 限制
- 仅允许你的域名访问 API
- 生产环境移除 `localhost` 允许

### 4. 速率限制
添加到 Worker:

```javascript
import { RateLimiter } from '@cloudflare/workers-types';

// 每 IP 每分钟最多 60 次请求
const limiter = new RateLimiter({ 
  requestsPerMinute: 60 
});

router.all('*', async (request, env) => {
  const ip = request.headers.get('CF-Connecting-IP');
  const { success } = await limiter.limit({ key: ip });
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  // 继续处理...
});
```

### 5. 图片访问控制

对于专属内容，使用 **Signed URLs**:

```javascript
// 生成 24 小时有效的签名 URL
router.get('/api/images/:key', async (request, env) => {
  const token = request.headers.get('Authorization');
  // 验证用户权限...
  
  const signedUrl = await env.IMAGES.createSignedUrl(
    request.params.key, 
    { expiresIn: 86400 }  // 24 小时
  );
  
  return Response.redirect(signedUrl);
});
```

---

## 📊 监控与日志

### 启用 Workers Analytics

在 Cloudflare Dashboard → Workers → Analytics 查看:
- 请求数量
- 错误率
- 响应时间
- CPU 使用率

### 添加日志

```javascript
router.post('/api/login', async (request, env, ctx) => {
  console.log('Login attempt:', { email: data.email });
  
  // ... 业务逻辑
  
  console.log('Login successful:', { userId: user.id });
});
```

在 Dashboard → Workers → Logs 实时查看。

---

## 🆘 常见问题

### Q: D1 数据库迁移失败
**A:** 确保 `wrangler.toml` 中的 `database_id` 正确，使用 `wrangler d1 list` 查看。

### Q: R2 图片无法访问
**A:** 检查 CORS 配置，确保你的域名在 `AllowedOrigins` 中。

### Q: JWT 验证失败
**A:** 确认 `JWT_SECRET` 在前端和 Worker 中一致。

### Q: 如何备份数据
**A:** 定期导出 D1:
```bash
wrangler d1 export kidswave-db --output=backup.sql
```

---

## 📞 下一步行动

1. ✅ 复制本文档到你的项目
2. ✅ 创建 Cloudflare 账户 (如未创建)
3. ✅ 安装 Wrangler CLI: `npm install -g wrangler`
4. ✅ 登录: `wrangler login`
5. ✅ 创建 D1 数据库
6. ✅ 创建 R2 存储桶
7. ✅ 部署 Worker API
8. ✅ 修改前端代码使用 API
9. ✅ 迁移现有数据
10. ✅ 测试完整流程

---

## 📝 附录：完整文件清单

```
kidswave-designer-portfolio/
├── src/
│   ├── services/
│   │   └── api.ts           # 新增：API 客户端
│   └── ...
├── kidswave-api/            # 新增：Workers 项目
│   ├── src/
│   │   └── index.js
│   ├── wrangler.toml
│   ├── package.json
│   └── schema.sql
├── CLOUDFLARE_SETUP.md      # 本文档
└── README.md
```

---

**祝部署顺利！如有问题，请参考 [Cloudflare Workers 官方文档](https://developers.cloudflare.com/workers/)**

#!/bin/bash

# KidsWave 部署前检查脚本
# 使用方法: chmod +x pre-deploy-check.sh && ./pre-deploy-check.sh

echo "🔍 KidsWave 部署前检查"
echo "====================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

WARNINGS=0
ERRORS=0

# 检查 Node.js
echo "📦 检查环境..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js 未安装"
    ((ERRORS++))
fi

# 检查 npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm 未安装"
    ((ERRORS++))
fi

# 检查 Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓${NC} Git: $GIT_VERSION"
else
    echo -e "${RED}✗${NC} Git 未安装"
    ((ERRORS++))
fi

echo ""
echo "📁 检查项目文件..."

# 检查必要文件
FILES=("package.json" "vite.config.ts" "App.tsx" "index.html" ".github/workflows/deploy.yml")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file 缺失"
        ((ERRORS++))
    fi
done

echo ""
echo "🔐 检查安全配置..."

# 检查是否使用默认密码
if grep -q "8888" App.tsx; then
    echo -e "${YELLOW}⚠${NC}  检测到默认会员密码 '8888'"
    ((WARNINGS++))
fi

if grep -q "admin666" App.tsx; then
    echo -e "${YELLOW}⚠${NC}  检测到默认管理员密码 'admin666'"
    ((WARNINGS++))
fi

echo ""
echo "⚙️  检查配置文件..."

# 检查 vite.config.ts 中的 base 配置
if grep -q "base: '/kidswave/'" vite.config.ts; then
    echo -e "${GREEN}✓${NC} Vite base 路径已配置"
else
    echo -e "${YELLOW}⚠${NC}  Vite base 路径可能需要调整"
    ((WARNINGS++))
fi

# 检查是否已安装依赖
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} 依赖已安装"
else
    echo -e "${YELLOW}⚠${NC}  依赖未安装，请运行 npm install"
    ((WARNINGS++))
fi

echo ""
echo "🔨 尝试构建项目..."

# 尝试构建
if npm run build &> /dev/null; then
    echo -e "${GREEN}✓${NC} 构建成功"
    if [ -d "dist" ]; then
        DIST_SIZE=$(du -sh dist | cut -f1)
        echo -e "   构建产物大小: $DIST_SIZE"
    fi
else
    echo -e "${RED}✗${NC} 构建失败，请检查代码"
    ((ERRORS++))
fi

echo ""
echo "📊 检查总结"
echo "=========="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ 完美！项目已准备好部署${NC}"
    echo ""
    echo "📋 下一步："
    echo "   1. 推送代码: git push"
    echo "   2. 在 GitHub 启用 Pages (Settings → Pages → GitHub Actions)"
    echo "   3. 等待自动部署完成"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ 发现 $WARNINGS 个警告，但可以继续部署${NC}"
    echo ""
    echo "建议："
    if grep -q "8888" App.tsx || grep -q "admin666" App.tsx; then
        echo "   - 修改默认密码以提高安全性"
    fi
else
    echo -e "${RED}✗ 发现 $ERRORS 个错误，请修复后再部署${NC}"
    exit 1
fi

echo ""
echo "🔗 部署后访问地址："
if grep -q "base: '/kidswave/'" vite.config.ts; then
    echo "   https://你的用户名.github.io/kidswave/"
else
    echo "   检查 vite.config.ts 确定正确的访问地址"
fi

echo ""
echo "📖 需要帮助？查看 DEPLOYMENT.md 或 QUICKSTART.md"

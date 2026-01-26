#!/bin/bash

# KidsWave GitHub Pages 部署初始化脚本
# 使用方法: chmod +x deploy-init.sh && ./deploy-init.sh

echo "🌊 KidsWave - GitHub Pages 部署初始化"
echo "======================================"
echo ""

# 检查是否已经是 git 仓库
if [ -d .git ]; then
    echo "⚠️  检测到已存在 Git 仓库"
    read -p "是否要重新初始化? (y/N): " confirm
    if [[ $confirm != [yY] ]]; then
        echo "取消操作"
        exit 0
    fi
    rm -rf .git
fi

# 获取 GitHub 用户名
read -p "请输入你的 GitHub 用户名 (默认: hahapokar): " github_user
github_user=${github_user:-hahapokar}

# 获取仓库名
read -p "请输入仓库名称 (默认: kidswave): " repo_name
repo_name=${repo_name:-kidswave}

echo ""
echo "📦 配置信息:"
echo "   GitHub 用户: $github_user"
echo "   仓库名称: $repo_name"
echo "   部署地址: https://$github_user.github.io/$repo_name/"
echo ""

# 更新 vite.config.ts 中的 base 路径
echo "🔧 更新 Vite 配置..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|base: '/kidswave/'|base: '/$repo_name/'|g" vite.config.ts
else
    # Linux
    sed -i "s|base: '/kidswave/'|base: '/$repo_name/'|g" vite.config.ts
fi

# 更新 App.tsx 中的管理员跳转路径
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|window.location.href = '/kidswave/admin/'|window.location.href = '/$repo_name/admin/'|g" App.tsx
else
    sed -i "s|window.location.href = '/kidswave/admin/'|window.location.href = '/$repo_name/admin/'|g" App.tsx
fi

echo "✅ 配置文件已更新"
echo ""

# 初始化 Git
echo "🔧 初始化 Git 仓库..."
git init
git add .
git commit -m "Initial commit: KidsWave portfolio"

# 添加远程仓库
remote_url="https://github.com/$github_user/$repo_name.git"
git remote add origin "$remote_url"

# 重命名分支为 main
git branch -M main

echo ""
echo "✅ Git 仓库初始化完成"
echo ""
echo "📋 下一步操作:"
echo "   1. 在 GitHub 上创建名为 '$repo_name' 的仓库"
echo "      URL: https://github.com/new"
echo ""
echo "   2. 推送代码到 GitHub:"
echo "      git push -u origin main"
echo ""
echo "   3. 在仓库设置中启用 GitHub Pages:"
echo "      - 进入 Settings → Pages"
echo "      - Source 选择 'GitHub Actions'"
echo ""
echo "   4. 等待部署完成后访问:"
echo "      https://$github_user.github.io/$repo_name/"
echo ""
echo "⚠️  安全提醒: 请修改默认密码！"
echo "   - 会员密码: 在 App.tsx 搜索 '8888'"
echo "   - 管理员密码: 在 App.tsx 搜索 'admin666'"
echo ""
echo "🎉 初始化完成！"

#!/bin/bash

# ============================================================
# js-framework-benchmark PR 准备脚本
# ============================================================

set -e

echo "=============================================="
echo "LytJS js-framework-benchmark PR 准备工具"
echo "=============================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 当前目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LYTJS_DIR="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

echo -e "${YELLOW}当前 LytJS 项目目录:${NC} $LYTJS_DIR"
echo ""

# 步骤 1: 检查文件
echo -e "${GREEN}[步骤 1/5]${NC} 检查实现文件..."

FILES_TO_CHECK=(
  "index.html"
  "package.json"
  "README.md"
)

ALL_FILES_EXIST=true
for FILE in "${FILES_TO_CHECK[@]}"; do
  if [ ! -f "$SCRIPT_DIR/$FILE" ]; then
    echo -e "  ${RED}✗ 缺少文件:${NC} $FILE"
    ALL_FILES_EXIST=false
  else
    echo -e "  ${GREEN}✓${NC} $FILE"
  fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
  echo ""
  echo -e "${RED}错误: 缺少必要文件${NC}"
  exit 1
fi

echo ""

# 步骤 2: 验证 package.json
echo -e "${GREEN}[步骤 2/5]${NC} 验证 package.json..."

if jq . "$SCRIPT_DIR/package.json" > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓${NC} package.json 格式有效"
  echo -e "  名称: $(jq -r .name "$SCRIPT_DIR/package.json")"
  echo -e "  版本: $(jq -r .version "$SCRIPT_DIR/package.json")"
  echo -e "  描述: $(jq -r .description "$SCRIPT_DIR/package.json")"
else
  echo -e "  ${RED}✗${NC} package.json 格式无效"
  exit 1
fi

echo ""

# 步骤 3: 验证 index.html
echo -e "${GREEN}[步骤 3/5]${NC} 验证 index.html..."

if grep -q "Create 1,000 rows" "$SCRIPT_DIR/index.html"; then
  echo -e "  ${GREEN}✓${NC} 包含 'Create 1,000 rows' 按钮"
else
  echo -e "  ${YELLOW}⚠${NC} 可能缺少 'Create 1,000 rows' 按钮"
fi

if grep -q "bootstrap" "$SCRIPT_DIR/index.html"; then
  echo -e "  ${GREEN}✓${NC} 包含 Bootstrap 样式"
else
  echo -e "  ${YELLOW}⚠${NC} 可能缺少 Bootstrap 样式"
fi

echo ""

# 步骤 4: 输出下一步
echo -e "${GREEN}[步骤 4/5]${NC} 准备就绪！"
echo ""

echo "=============================================="
echo "下一步操作"
echo "=============================================="
echo ""

echo "1. 访问 https://github.com/krausest/js-framework-benchmark 并 Fork"
echo ""

echo "2. 克隆你的 Fork:"
echo "   git clone https://github.com/YOUR_USERNAME/js-framework-benchmark.git"
echo "   cd js-framework-benchmark"
echo ""

echo "3. 创建新分支:"
echo "   git checkout -b add-lytjs"
echo ""

echo "4. 复制实现:"
echo "   cp -r \"$SCRIPT_DIR\" frameworks/keyed/"
echo ""

echo "5. 提交更改:"
echo "   git add frameworks/keyed/lytjs"
echo "   git commit -m \"Add LytJS v6.1.0 - Lightweight Zero-Dependency Framework\""
echo ""

echo "6. 推送到 GitHub:"
echo "   git push origin add-lytjs"
echo ""

echo "7. 创建 Pull Request"
echo ""

echo "=============================================="
echo "详细说明请查看: PR_PREPARATION_GUIDE.md"
echo "=============================================="
echo ""

# 步骤 5: 询问是否启动本地测试
read -p "是否启动本地服务器进行测试? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "启动本地服务器..."
  echo "访问: http://localhost:8080"
  echo "按 Ctrl+C 停止"
  echo ""
  cd "$SCRIPT_DIR"
  python3 -m http.server 8080 2>/dev/null || python -m http.server 8080
fi

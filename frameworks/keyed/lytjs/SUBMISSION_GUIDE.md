# js-framework-benchmark 提交流程

本指南说明如何将 LytJS 实现提交到官方 js-framework-benchmark 仓库。

## 🚀 一键脚本（推荐）

项目已提供一键脚本，自动完成整个提交流程：

```bash
cd benchmarks
pnpm pr:benchmark all
```

### 脚本命令说明

| 命令 | 说明 |
|------|------|
| `setup` | Fork 并克隆官方仓库 |
| `prepare` | 复制 LytJS 实现到目标仓库 |
| `validate` | 验证实现是否符合要求 |
| `commit` | 提交更改 |
| `push` | 推送到 GitHub 并创建 PR |
| `all` | 执行完整流程 |

### 脚本位置

- Windows: `benchmarks/scripts/js-framework-benchmark-pr.ps1`
- Linux/Mac: `benchmarks/scripts/js-framework-benchmark-pr.sh`

## 📋 手动提交流程

如果需要手动操作，请按照以下步骤进行：

### 1. Fork 官方仓库

访问 https://github.com/krausest/js-framework-benchmark，点击 Fork 按钮。

### 2. 克隆你的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/js-framework-benchmark.git
cd js-framework-benchmark
```

### 3. 创建新分支

```bash
git checkout -b add-lytjs
```

### 4. 复制 LytJS 实现

```bash
# 从 LytJS 项目复制实现
cp -r /path/to/lytjs/benchmarks/js-framework-benchmark/frameworks/keyed/lytjs frameworks/keyed/
```

### 5. 更新框架列表

编辑 `frameworks/keyed/` 下的相关文件（如果需要）。

### 6. 构建并测试

```bash
# 安装依赖
npm install

# 运行构建
npm run build-prod

# 运行基准测试
npm run bench
```

### 7. 提交更改

```bash
git add frameworks/keyed/lytjs
git commit -m "Add LytJS v6.0.0 framework"
```

### 8. 推送并创建 PR

```bash
git push origin add-lytjs
```

然后在 GitHub 上创建 Pull Request。

## 📝 PR 内容建议

### PR 标题

```
Add LytJS v6.0.0 - Lightweight Zero-Dependency Framework
```

### PR 描述

```
## LytJS v6.0.0

LytJS 是一个轻量级、零第三方依赖的前端框架，提供双重渲染模式（Vapor 模式 + 虚拟 DOM）。

### 核心特性
- 🚀 零运行时第三方依赖
- ⚡ Signal 响应式系统
- 🔄 Vapor 模式（无虚拟 DOM）+ 虚拟 DOM 双模式
- 📦 核心库 < 10KB

### 实现说明
本实现使用 LytJS 的 Signal 响应式系统 + 直接 DOM 操作，提供极致性能。

### 相关链接
- 官网：https://lytjs.dev
- 仓库：https://github.com/lytjs/lytjs
```

## 📊 性能说明

根据内部基准测试：
- 单节点更新：138,434 ops/s
- 1000行创建：3,329 ops/s
- 1000行更新：1,131 ops/s

## ⏱️ 验收标准

- [ ] 所有测试场景正常工作
- [ ] 构建成功
- [ ] 性能基准测试通过
- [ ] 代码符合仓库规范

## 📚 参考

- 官方仓库：https://github.com/krausest/js-framework-benchmark
- 贡献指南：https://github.com/krausest/js-framework-benchmark/blob/master/CONTRIBUTING.md
- LytJS 项目：https://github.com/lytjs/lytjs

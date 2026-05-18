# LytJS v6.4.0 - js-framework-benchmark Implementation

这是一个 LytJS 的 js-framework-benchmark 实现，展示了 LytJS Signal + 直接 DOM 操作的极致性能。

## 🚀 快速开始

### 无需构建 - 直接在浏览器中运行

1. 在浏览器中打开 `index.html` 文件
2. 或者使用本地服务器：`python -m http.server 8080`（在文件目录中）
3. 然后访问 http://localhost:8080

### 使用 Vite 开发服务器

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📊 实现说明

### 核心特性

- **Signal 响应式系统**：简化版 Signal 实现，展示核心响应式原理
- **直接 DOM 操作**：无虚拟 DOM 开销，极致性能
- **批量更新优化**：使用 batch 减少渲染次数
- **DocumentFragment**：批量 DOM 操作优化
- **requestAnimationFrame**：防抖渲染优化

### 实现的测试场景

| 场景           | 按钮                    | 说明                     |
| -------------- | ----------------------- | ------------------------ |
| 创建 1,000 行  | `Create 1,000 rows`     | 生成 1,000 个随机数据行  |
| 创建 10,000 行 | `Create 10,000 rows`    | 生成 10,000 个随机数据行 |
| 追加 1,000 行  | `Append 1,000 rows`     | 向现有数据追加 1,000 行  |
| 更新每 10 行   | `Update every 10th row` | 更新每第 10 行的文本     |
| 清空表格       | `Clear`                 | 清空所有数据             |
| 交换行         | `Swap Rows`             | 交换第 1 行和第 998 行   |

## 🔧 技术细节

### Signal 实现

```javascript
function signal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  const signalFn = function () {
    // 读取值并追踪订阅者
    return value;
  };

  signalFn.set = function (newValue) {
    if (Object.is(newValue, value)) return;
    value = newValue;
    // 通知所有订阅者
    subscribers.forEach((sub) => sub());
  };

  signalFn._subscribe = function (subscriber) {
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  };

  return signalFn;
}
```

### 性能优化策略

1. **批量更新**：使用 `batch()` 包裹多次状态更新
2. **DocumentFragment**：一次性插入多个 DOM 节点
3. **防抖渲染**：使用 `requestAnimationFrame` 避免频繁渲染
4. **事件委托**：减少事件监听器数量

## 📈 性能基准

根据最新基准测试数据（2026-05-18）：

| 指标               | 数值         | 评级            |
| ------------------ | ------------ | --------------- |
| **单节点更新**     | 158,873 ops/s | ⭐⭐⭐⭐⭐ 卓越 |
| **交换两行**       | 25,010 ops/s  | ⭐⭐⭐⭐ 优秀   |
| **删除中间行**     | 24,699 ops/s  | ⭐⭐⭐⭐ 优秀   |
| **反转列表**       | 24,175 ops/s  | ⭐⭐⭐⭐ 优秀   |
| **筛选列表(一半)** | 21,480 ops/s  | ⭐⭐⭐⭐ 优秀   |
| **排序**           | 4,732 ops/s  | ⭐⭐⭐ 良好     |
| **选择行(高亮)**   | 4,997 ops/s  | ⭐⭐⭐ 良好     |
| **追加1000行**     | 9,987 ops/s  | ⭐⭐⭐⭐ 良好     |
| **前置1000行**     | 10,161 ops/s  | ⭐⭐⭐⭐ 良好     |
| **更新1000节点**   | 1,251 ops/s  | ⭐⭐⭐ 一般     |
| **综合评分**       | -            | ⭐⭐⭐⭐ 优秀   |

详细性能数据请参考：[PERFORMANCE_BASELINE_AND_PLANS.md](../../docs/development/PERFORMANCE_BASELINE_AND_PLANS.md)

## 📁 项目结构

```
lytjs/
└── benchmarks/
    └── js-framework-benchmark/
        └── frameworks/
            └── keyed/
                └── lytjs/
                    ├── index.html          # 完整实现（包含 Signal）
                    └── README.md           # 本文档
```

## 🤝 与官方集成

要将此实现提交到官方 js-framework-benchmark 仓库：

1. 克隆官方仓库
2. 复制 `lytjs/` 目录到 `frameworks/keyed/`
3. 添加构建配置（使用 Vite 或其他构建工具）
4. 按照官方文档运行基准测试

## 📚 相关文档

- [ROADMAP_NEXT_STEPS.md](../../docs/development/ROADMAP_NEXT_STEPS.md)
- [PERFORMANCE_BASELINE_AND_PLANS.md](../../docs/development/PERFORMANCE_BASELINE_AND_PLANS.md)
- [js-framework-benchmark 官方仓库](https://github.com/krausest/js-framework-benchmark)
- [LytJS 官方文档](https://lytjs.dev)

## 📄 License

MIT License - 与 LytJS 项目保持一致

---

**版本**：v6.4.0
**最后更新**：2026-05-18
**维护者**：LytJS Team

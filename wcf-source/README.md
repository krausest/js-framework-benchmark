# WCF Framework

A high-performance, compile-time optimized web component framework.

## Installation

```bash
npm install wcf
```

## Quick Start

```typescript
import { Component, registerComponent, signal } from 'wcf';

const MyComponent = registerComponent(
  { selector: 'my-component', type: 'component' },
  class extends Component {
    private _count = signal(0);

    render = () => html`
      <button @click=${() => this._count(this._count() + 1)}>
        Count: ${this._count()}
      </button>
    `;
  }
);
```

---

## Performance Optimization Notes

> **TODO: Expand this section for full documentation**

### repeat() Directive Optimization

The compiler automatically optimizes `repeat()` directives when certain conditions are met. When optimized, the framework uses **template cloning** instead of HTML string parsing, resulting in significantly faster rendering.

#### Optimized Path Requirements

Your repeat template will use the fast path when **ALL** of these conditions are met:

| Requirement | ✅ Optimized | ❌ Falls back |
|-------------|-------------|---------------|
| Single root element | `<tr>...</tr>` | `<td>A</td><td>B</td>` |
| Pure item bindings | `${item.name}` | `${this._theme()}` |
| No nested repeats | Flat list | `repeat()` inside `repeat()` |
| No conditionals inside | Direct bindings | `when()` inside items |
| No item event handlers | Use container delegation | `@click=${...}` on item |

#### What Happens When Not Optimized

When the optimized path cannot be used, the compiler will:

1. **Multi-root template**: Emit an **error** (build continues, but you should fix)
2. **Other patterns**: Log at **verbose** level (visible with `--verbose` flag)

The framework will still work correctly using the fallback string-based approach.

#### Best Practices for Performance

```typescript
// ✅ GOOD - Uses optimized path
${repeat(this._items(), (item) => html`
  <tr data-id="${item.id}">
    <td>${item.name}</td>
  </tr>
`, null, item => item.id)}

// ❌ AVOID - Component signal inside item (use data model instead)
${repeat(this._items(), (item) => html`
  <tr class="${this._selectedClass()}">  <!-- this._selectedClass() prevents optimization -->
    <td>${item.name}</td>
  </tr>
`)}

// ✅ GOOD - Event delegation on container
<tbody @click=${this._handleClick}>
  ${repeat(this._items(), (item) => html`
    <tr data-id="${item.id}" data-action="select">
      <td>${item.name}</td>
    </tr>
  `)}
</tbody>

// ❌ AVOID - Event handler on each item
${repeat(this._items(), (item) => html`
  <tr @click=${() => this.select(item)}>  <!-- prevents optimization -->
    <td>${item.name}</td>
  </tr>
`)}
```

#### trackBy Function

The `trackBy` function (4th argument to `repeat()`) should return a unique `string` or `number` for each item:

```typescript
// ✅ Correct - returns unique ID
repeat(items, template, null, item => item.id)

// ✅ Correct - can use index as fallback
repeat(items, template, null, (item, index) => index)

// ❌ Incorrect - returns object (will warn at compile time)
repeat(items, template, null, item => item)
```

---

## CLI

```bash
# Development build with watch
wcf dev --entry ./main.ts --out ./dist

# Production build
wcf build --prod --entry ./main.ts --out ./dist

# Serve production build
wcf serve --prod --entry ./main.ts --out ./dist
```

---

## License

MIT

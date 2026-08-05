# Domphy — keyed implementation

[Domphy](https://domphy.com/) is a patch-based, framework-agnostic UI runtime.
No JSX, no virtual DOM: UIs are plain objects keyed by HTML tag and reactivity
is listener-based (`toState`).

This implementation uses the framework's idiomatic fine-grained style:

- one keyed `State<Row[]>` for the row list (`_key` per row drives the keyed
  reconciler),
- per-row `label` states, so "update every 10th row" re-renders only those
  rows' text,
- one table-level `selected` id state; each row derives its `danger` class
  from it,
- row element descriptors are created once per row and reused across list
  re-renders, so unchanged rows skip patching on reorder/remove.

## Build

```
npm install
npm run build-prod
```

This bundles `src/main.ts` with esbuild into `dist/main.js`.

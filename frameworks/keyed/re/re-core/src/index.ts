/**
 * @re — the minimal, fastest frontend framework.
 *
 * Native-level experience, zero learning curve:
 *   - templates are real HTML (tagged templates, compiled once, cloned fast)
 *   - components are real Web Components (custom elements)
 *   - state is fine-grained signals (direct DOM updates, no VDOM, no diff)
 *   - lists are anchored keyed views with O(1) direct ops
 *
 * Zero dependencies. ~4KB min+gz.
 */

export {
  signal,
  computed,
  effect,
  batch,
  untrack,
  isSignal,
} from './signal.ts';
export type { Signal, Computed, Reactive, Sub } from './signal.ts';

export {
  html,
  append,
  registerTemplates,
  __wireTemplate,
  __compileDebug,
  ReFragment,
} from './template.ts';
export type { Slot, CompiledTemplate } from './template.ts';

export { each, KeyedView } from './each.ts';
export type { EachDirective, RowEntry } from './each.ts';

export { defineElement } from './element.ts';
export type { ElementOptions } from './element.ts';

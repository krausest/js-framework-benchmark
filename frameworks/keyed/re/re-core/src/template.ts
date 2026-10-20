/**
 * @re/core — tagged-template DOM engine
 *
 * `html` compiles a template literal ONCE per call-site (cached by the template
 * strings identity), then clones pre-built template content per instance and
 * wires only the dynamic slots. No virtual DOM, no diffing for static parts.
 *
 * Marker format: \u0001<index>\u0002 for both text and attribute bindings.
 *
 * The compile step (HTML string -> {content, slots[]}) can be moved to build
 * time by @re/compiler (Zig) + @re/vite-plugin: `__wireTemplate` consumes a
 * precomputed slot list and skips parsing/walking entirely. A runtime
 * `registerTemplates` registry is also honored on WeakMap misses.
 */

import { effect, isSignal, owner } from './signal.ts';
import type { Sub } from './signal.ts';

/* ------------------------------------------------------------------ */
/* types                                                               */
/* ------------------------------------------------------------------ */

/** Slot kinds. */
const T_TEXT = 0; // child position (text, node, view)
const T_ATTR = 1; // dynamic attribute/event/ref (marker-only value)
const T_PARTS = 2; // interpolated attribute (mixed static + markers)

export interface Slot {
  k: 0 | 1 | 2;
  /** binding index into vals */
  i?: number;
  /** child-index path from the template root */
  p: number[];
  /** attribute name */
  n?: string;
  /** interpolated parts (string literal | binding index) */
  parts?: (string | number)[];
}

export interface CompiledTemplate {
  content: DocumentFragment;
  slots: Slot[];
}

/**
 * A mounted template: a real DocumentFragment you can `append()` anywhere.
 * `root` is the first top-level node (for keyed list entries).
 * `mounts` are deferred for directives that need the final parent (each()).
 * Both arrays are lazily allocated — static-heavy templates allocate nothing.
 */
export class ReFragment extends DocumentFragment {
  root: Node | null = null;
  disposers: (() => void)[] | null = null;
  mounts: (() => void)[] | null = null;

  dispose(): void {
    const d = this.disposers;
    if (d !== null) {
      this.disposers = null;
      for (let i = 0; i < d.length; i++) d[i]!();
    }
  }
}

/* ------------------------------------------------------------------ */
/* compile                                                             */
/* ------------------------------------------------------------------ */

const cache = new WeakMap<TemplateStringsArray, CompiledTemplate>();
const precompiled = new Map<string, Slot[]>();

const MARKER_RE = /\u0001(\d+)\u0002/g;
const MARKER_FULL_RE = /^\u0001(\d+)\u0002$/;

function joinHtml(strings: readonly string[]): string {
  let out = strings[0] ?? '';
  for (let i = 1; i < strings.length; i++) {
    out += '\u0001' + (i - 1) + '\u0002' + strings[i];
  }
  return out;
}

function walk(parent: Node, base: number[], slots: Slot[]): void {
  let i = 0;
  const cn = parent.childNodes;
  while (i < cn.length) {
    const n = cn[i]!;
    const nt = n.nodeType;
    if (nt === 3) {
      const data = (n as Text).data;
      if (data.indexOf('\u0001') >= 0) {
        const frag = document.createDocumentFragment();
        const re = MARKER_RE;
        re.lastIndex = 0;
        let last = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(data)) !== null) {
          if (m.index > last) {
            frag.appendChild(document.createTextNode(data.slice(last, m.index)));
          }
          const j = frag.childNodes.length;
          frag.appendChild(document.createTextNode(''));
          const p = [...base, i + j];
          slots.push({ k: T_TEXT, i: +m[1]!, p });
          last = m.index + m[0].length;
        }
        if (last < data.length) {
          frag.appendChild(document.createTextNode(data.slice(last)));
        }
        parent.replaceChild(frag, n);
        i += frag.childNodes.length;
        continue;
      }
    } else if (nt === 1) {
      const el = n as Element;
      const attrs = el.attributes;
      for (let a = 0; a < attrs.length; a++) {
        const attr = attrs[a]!;
        const val = attr.value;
        if (val.indexOf('\u0001') < 0) continue;
        const sm = MARKER_FULL_RE.exec(val);
        const p = [...base, i];
        if (sm !== null) {
          slots.push({ k: T_ATTR, i: +sm[1]!, n: attr.name, p });
        } else {
          const parts: (string | number)[] = [];
          const re2 = MARKER_RE;
          re2.lastIndex = 0;
          let last = 0;
          let m2: RegExpExecArray | null;
          while ((m2 = re2.exec(val)) !== null) {
            if (m2.index > last) parts.push(val.slice(last, m2.index));
            parts.push(+m2[1]!);
            last = m2.index + m2[0].length;
          }
          if (last < val.length) parts.push(val.slice(last));
          slots.push({ k: T_PARTS, n: attr.name, parts, p });
        }
      }
      // <template> children live in .content (mirrors the DOM and parse5)
      if (el.tagName === 'TEMPLATE') {
        walk((el as HTMLTemplateElement).content, [...base, i], slots);
      } else {
        walk(el, [...base, i], slots);
      }
    }
    i++;
  }
}

function buildContent(htmlStr: string): DocumentFragment {
  const el = document.createElement('template');
  el.innerHTML = htmlStr;
  return el.content;
}

/**
 * Split text nodes that contain binding markers into
 * [static, marker, static, ...] sequences. HTML parsers merge adjacent text,
 * but slot paths address the SPLIT structure — the runtime walker does this
 * while compiling; the precompiled path (buildCompiled) needs it too, and it
 * is applied once per template so every clone is pre-split.
 */
function normalizeContent(parent: Node): void {
  let i = 0;
  const cn = parent.childNodes;
  while (i < cn.length) {
    const n = cn[i]!;
    const nt = n.nodeType;
    if (nt === 3) {
      const data = (n as Text).data;
      if (data.indexOf('\u0001') >= 0) {
        const frag = document.createDocumentFragment();
        const re = MARKER_RE;
        re.lastIndex = 0;
        let last = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(data)) !== null) {
          if (m.index > last) {
            frag.appendChild(document.createTextNode(data.slice(last, m.index)));
          }
          frag.appendChild(document.createTextNode(''));
          last = m.index + m[0].length;
        }
        if (last < data.length) {
          frag.appendChild(document.createTextNode(data.slice(last)));
        }
        parent.replaceChild(frag, n);
        i += frag.childNodes.length;
        continue;
      }
    } else if (nt === 1) {
      const el = n as Element;
      if (el.tagName === 'TEMPLATE') {
        normalizeContent((el as HTMLTemplateElement).content);
      } else {
        normalizeContent(el);
      }
    }
    i++;
  }
}

function compile(strings: TemplateStringsArray): CompiledTemplate {
  const content = buildContent(joinHtml(strings));
  const slots: Slot[] = [];
  walk(content, [], slots);
  return { content, slots };
}

function buildCompiled(strings: readonly string[], slots: Slot[]): CompiledTemplate {
  const content = buildContent(joinHtml(strings));
  normalizeContent(content);
  return { content, slots };
}

/* ------------------------------------------------------------------ */
/* wiring                                                              */
/* ------------------------------------------------------------------ */

function fmt(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v == null) return '';
  return String(v);
}

function setPropOrAttr(el: Element, name: string, v: unknown): void {
  if (name === 'class') {
    el.className = fmt(v);
    return;
  }
  if (name === 'style') {
    (el as HTMLElement).style.cssText = fmt(v);
    return;
  }
  if (name in el) {
    try {
      (el as unknown as Record<string, unknown>)[name] = v;
      return;
    } catch {
      /* readonly property — fall through to attribute */
    }
  }
  el.setAttribute(name, fmt(v));
}

function wireAttr(el: Element, name: string, v: unknown, frag: ReFragment): void {
  if (typeof v === 'function') {
    if (name.charCodeAt(0) === 111 && name.charCodeAt(1) === 110) {
      // on* — property assignment when supported (fastest), else addEventListener
      if (name in el) {
        (el as unknown as Record<string, unknown>)[name] = v;
      } else {
        el.addEventListener(name.slice(2), v as EventListener);
      }
    } else if (name === 'ref') {
      (v as (el: Element) => void)(el);
    } else {
      setPropOrAttr(el, name, v);
    }
    return;
  }
  if (isSignal(v)) {
    const sub: Sub = {
      run(nv: unknown) {
        setPropOrAttr(el, name, nv);
      },
    };
    setPropOrAttr(el, name, v.value);
    v.$sub(sub);
    if ((v as { _own?: object })._own !== owner.current) {
      const sig = v;
      if (frag.disposers === null) frag.disposers = [];
      frag.disposers.push(() => {
        sig.$unsub(sub);
      });
    }
    return;
  }
  setPropOrAttr(el, name, v);
}

function instantiate(c: CompiledTemplate, vals: unknown[]): ReFragment {
  const frag = new ReFragment();
  const clone = c.content.cloneNode(true);
  while (clone.firstChild !== null) frag.appendChild(clone.firstChild);
  frag.root = frag.firstChild;
  const slots = c.slots;

  for (let s = 0; s < slots.length; s++) {
    const slot = slots[s]!;
    // inline path descent (hot path — avoids a call per slot)
    let node = frag as Node;
    const p = slot.p;
    for (let k = 0; k < p.length; k++) node = node.childNodes[p[k]!]!;
    if (slot.k === T_TEXT) {
      const t = node as Text;
      const v = vals[slot.i!];
      if (isSignal(v)) {
        t.data = fmt(v.value);
        const sub: Sub = {
          run(nv: unknown) {
            t.data = fmt(nv);
          },
        };
        v.$sub(sub);
        // Skip unsubscribe for signals created inside this row's render —
        // both die together, so cleanup would be dead weight.
        if ((v as { _own?: object })._own !== owner.current) {
          const sig = v;
          if (frag.disposers === null) frag.disposers = [];
          frag.disposers.push(() => {
            sig.$unsub(sub);
          });
        }
      } else if (typeof v === 'function') {
        if (frag.disposers === null) frag.disposers = [];
        frag.disposers.push(
          effect(() => {
            t.data = fmt((v as () => unknown)());
          }),
        );
      } else if (v !== null && typeof v === 'object') {
        const eachDir = v as { _$each?: boolean; _mount(a: Node): unknown };
        if (eachDir._$each === true) {
          const view = eachDir._mount(t);
          if (frag.mounts === null) frag.mounts = [];
          frag.mounts.push(() => (view as { mount(): void }).mount());
          if (frag.disposers === null) frag.disposers = [];
          frag.disposers.push(() => (view as { dispose(): void }).dispose());
        } else if (v instanceof Node) {
          t.parentNode!.insertBefore(v, t);
          t.remove();
          if (v instanceof ReFragment) {
            if (v.mounts !== null) {
              if (frag.mounts === null) frag.mounts = [];
              for (let k = 0; k < v.mounts.length; k++) frag.mounts.push(v.mounts[k]!);
            }
            if (v.disposers !== null) {
              if (frag.disposers === null) frag.disposers = [];
              for (let k = 0; k < v.disposers.length; k++) frag.disposers.push(v.disposers[k]!);
            }
          }
        } else {
          throw new Error('[re] unsupported child binding type: ' + (v as object).constructor?.name);
        }
      } else {
        t.data = fmt(v);
      }
    } else if (slot.k === T_ATTR) {
      wireAttr(node as Element, slot.n!, vals[slot.i!], frag);
    } else {
      // T_PARTS — interpolated attribute, tracked via effect
      const el = node as Element;
      const name = slot.n!;
      const parts = slot.parts!;
      if (frag.disposers === null) frag.disposers = [];
      frag.disposers.push(
        effect(() => {
          let out = '';
          for (let j = 0; j < parts.length; j++) {
            const part = parts[j]!;
            if (typeof part === 'number') {
              const pv = vals[part];
              out += isSignal(pv) ? fmt(pv.value) : fmt(pv);
            } else {
              out += part;
            }
          }
          setPropOrAttr(el, name, out);
        }),
      );
    }
  }
  return frag;
}

/* ------------------------------------------------------------------ */
/* public API                                                          */
/* ------------------------------------------------------------------ */

export function html(strings: TemplateStringsArray, ...vals: unknown[]): ReFragment {
  let compiled = cache.get(strings);
  if (compiled === undefined) {
    const pre = precompiled.get(strings.join('\u0000'));
    compiled = pre !== undefined ? buildCompiled(strings, pre) : compile(strings);
    cache.set(strings, compiled);
  }
  return instantiate(compiled, vals);
}

/**
 * Append fragments/nodes to a parent, then run any deferred directive mounts
 * (each() views need the final parent). This is the canonical way to mount an
 * `html` fragment that contains an `each()` directive.
 */
export function append(
  parent: ParentNode,
  ...nodes: (Node | null | undefined | false)[]
): void {
  const pending: (() => void)[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n === null || n === undefined || n === false) continue;
    parent.appendChild(n);
    if (n instanceof ReFragment) {
      const m = n.mounts;
      if (m !== null) {
        for (let k = 0; k < m.length; k++) pending.push(m[k]!);
      }
    }
  }
  for (let i = 0; i < pending.length; i++) pending[i]!();
}

/** Register precompiled slots for a template key (strings joined with \u0000). */
export function registerTemplates(key: string, slots: Slot[]): void {
  precompiled.set(key, slots);
}

/**
 * Debug/testing export: run the runtime compiler on a template and return the
 * joined HTML string + slots. Used by @re/compiler parity fixtures.
 */
export function __compileDebug(strings: readonly string[]): {
  html: string;
  slots: Slot[];
} {
  const htmlStr = joinHtml(strings);
  const content = buildContent(htmlStr);
  const slots: Slot[] = [];
  walk(content, [], slots);
  return { html: htmlStr, slots };
}

/** Build-time integration: returns a tag function bound to a precompiled template. */
export function __wireTemplate(
  strings: readonly string[],
  slots: string | Slot[],
): (s: TemplateStringsArray, ...vals: unknown[]) => ReFragment {
  const parsed = typeof slots === 'string' ? (JSON.parse(slots) as Slot[]) : slots;
  const compiled = buildCompiled(strings, parsed);
  return (_s: TemplateStringsArray, ...vals: unknown[]) => instantiate(compiled, vals);
}

/**
 * @re/core — anchored keyed list engine
 *
 * `each(list, key, render)` renders a keyed list anchored at a marker node.
 * All operations are performed with direct DOM primitives:
 *
 *   append  -> detached-container batch build or DocumentFragment insert
 *   clear   -> parent.replaceChildren(anchor)          (O(1) fast path)
 *   replace -> parent.replaceChildren(anchor, frag)    (O(1) fast path)
 *   swap    -> two insertBefore moves                  (O(1) via .swap())
 *   remove  -> node.remove() + registry delete         (O(1) via .remove())
 *   reorder -> order pass with moves only where needed
 *
 * The view keeps a Map<key, entry> so callers can do O(1) imperative ops
 * (selection highlight, swap, removal) while the reactive sync path handles
 * declarative updates with automatic fast-path detection.
 */

import type { Signal, Sub } from './signal.ts';
import { owner } from './signal.ts';
import { ReFragment } from './template.ts';

export interface RowEntry<T> {
  root: Node;
  /** owning fragment (bindings lifetime); null for plain nodes */
  fr: ReFragment | null;
  item: T;
}

export class KeyedView<T> {
  readonly anchor: Node;

  private readonly _list: Signal<readonly T[]> | readonly T[];
  private readonly _isSig: boolean;
  private readonly _key: (item: T) => unknown;
  private readonly _render: (item: T) => Node;
  private readonly _map = new Map<unknown, RowEntry<T>>();
  private _last: readonly T[] = [];
  private _sub: Sub | null = null;
  private _mounted = false;
  /** true once any row produced a ReFragment (disposers needed on teardown) */
  private _hasFr = false;
  /** creation-context token: signals born during row render die with the row */
  private readonly _ctx = {};

  constructor(
    anchor: Node,
    list: Signal<readonly T[]> | readonly T[],
    key: (item: T) => unknown,
    render: (item: T) => Node,
  ) {
    this.anchor = anchor;
    this._list = list;
    this._isSig = isSig(list);
    this._key = key;
    this._render = render;
  }

  /** The anchor's real parent, resolved lazily — never stale. */
  private get _pn(): ParentNode {
    return this.anchor.parentNode as ParentNode;
  }

  /** Called once the anchor is in its final parent (via append()/mount()). */
  mount(): void {
    if (this._mounted) return;
    this._mounted = true;
    // Normalize the container: whitespace-only text siblings are invisible but
    // would permanently disable the O(1) container fast paths (replaceChildren).
    const parent = this.anchor.parentNode;
    if (parent !== null) {
      let c = parent.firstChild;
      while (c !== null) {
        const next = c.nextSibling;
        if (c !== this.anchor && c.nodeType === 3 && (c as Text).data.trim() === '') {
          parent.removeChild(c);
        }
        c = next;
      }
    }
    const initial = this._isSig
      ? (this._list as Signal<readonly T[]>).peek()
      : (this._list as readonly T[]);
    if (this._isSig) {
      const view = this;
      this._sub = {
        run(v: unknown) {
          view.sync(v as readonly T[]);
        },
      };
      (this._list as Signal<readonly T[]>).$sub(this._sub);
    }
    this.sync(initial);
  }

  /* ---------------------------------------------------------------- */
  /* reactive sync (declarative path)                                  */
  /* ---------------------------------------------------------------- */

  sync(next: readonly T[]): void {
    if (!this._mounted) this.mount();
    const old = this._last;
    // Signal mode: same reference = nothing to do. Plain-array mode allows
    // in-place mutation, so identity equality does not imply no-change.
    if (next === old && this._isSig) return;

    if (next.length === 0) {
      this._clearAll();
      this._commit(next);
      return;
    }
    if (old.length === 0) {
      this._appendAll(next);
      this._commit(next);
      return;
    }

    const key = this._key;

    // Fast path: old is a strict prefix of next -> append the tail.
    if (next.length > old.length) {
      let prefix = true;
      for (let i = 0; i < old.length; i++) {
        if (key(old[i]!) !== key(next[i]!)) {
          prefix = false;
          break;
        }
      }
      if (prefix) {
        this._appendAll(next.slice(old.length));
        this._commit(next);
        return;
      }
    }

    // Fast path: no common keys -> single replaceChildren.
    let common = false;
    const map = this._map;
    for (let i = 0; i < next.length; i++) {
      if (map.has(key(next[i]!))) {
        common = true;
        break;
      }
    }
    if (!common) {
      this._replaceAll(next);
      this._commit(next);
      return;
    }

    this._diff(next);
    this._commit(next);
  }

  /** Signal mode keeps the array reference; plain-array mode takes a snapshot. */
  private _commit(next: readonly T[]): void {
    this._last = this._isSig ? next : next.slice();
  }

  private _diff(next: readonly T[]): void {
    const map = this._map;
    const parent = this._pn;
    const key = this._key;

    // removals
    const nextKeys = new Set<unknown>();
    for (let i = 0; i < next.length; i++) nextKeys.add(key(next[i]!));
    if (map.size !== 0) {
      for (const [k, e] of map) {
        if (!nextKeys.has(k)) {
          e.fr?.dispose();
          (e.root as ChildNode).remove();
          map.delete(k);
        }
      }
    }

    // order + inserts (moves only where actually needed)
    let ref = this.anchor as ChildNode;
    for (let i = 0; i < next.length; i++) {
      const item = next[i]!;
      const k = key(item);
      let e = map.get(k);
      if (e === undefined) {
        e = this._create(item);
        map.set(k, e);
      }
      const r = e.root as ChildNode;
      if (ref.nextSibling !== r) parent.insertBefore(r, ref.nextSibling);
      this._runMounts(e);
      ref = r;
    }
  }

  /* ---------------------------------------------------------------- */
  /* O(1) direct ops (imperative path)                                 */
  /* ---------------------------------------------------------------- */

  ref(key: unknown): Node | null {
    return this._map.get(key)?.root ?? null;
  }

  get size(): number {
    return this._map.size;
  }

  /** Swap two rows by key in O(1). Updates the source list quietly. */
  swap(ka: unknown, kb: unknown): void {
    if (ka === kb) return;
    const ea = this._map.get(ka);
    const eb = this._map.get(kb);
    if (ea === undefined || eb === undefined) return;
    if (!this._mounted) this.mount();
    const a = ea.root as ChildNode;
    const b = eb.root as ChildNode;
    // order: x precedes y in the DOM
    const bFollows = (a.compareDocumentPosition(b) & 4) !== 0; // FOLLOWING
    const x = bFollows ? a : b;
    const y = bFollows ? b : a;
    const parent = this._pn;
    const yNext = y.nextSibling;
    parent.insertBefore(y, x);
    parent.insertBefore(x, yNext);
    this._applyListSwap(ka, kb);
  }

  private _applyListSwap(ka: unknown, kb: unknown): void {
    const key = this._key;
    const arr = this._last as T[];
    let ia = -1;
    let ib = -1;
    for (let i = 0; i < arr.length; i++) {
      const k = key(arr[i]!);
      if (k === ka) ia = i;
      else if (k === kb) ib = i;
      if (ia >= 0 && ib >= 0) break;
    }
    if (ia >= 0 && ib >= 0) {
      const tmp = arr[ia]!;
      arr[ia] = arr[ib]!;
      arr[ib] = tmp;
      if (this._isSig) {
        (this._list as Signal<readonly T[]>).setQuiet(arr);
      } else {
        // keep the caller-owned array in sync too
        const ua = this._list as T[];
        let ja = -1;
        let jb = -1;
        for (let i = 0; i < ua.length; i++) {
          const k = key(ua[i]!);
          if (k === ka) ja = i;
          else if (k === kb) jb = i;
          if (ja >= 0 && jb >= 0) break;
        }
        if (ja >= 0 && jb >= 0) {
          const t2 = ua[ja]!;
          ua[ja] = ua[jb]!;
          ua[jb] = t2;
        }
      }
    }
  }

  /** Remove one row by key in O(1). Updates the source list quietly. */
  remove(key: unknown): void {
    const e = this._map.get(key);
    if (e === undefined) return;
    if (!this._mounted) this.mount();
    e.fr?.dispose();
    (e.root as ChildNode).remove();
    this._map.delete(key);
    const keyFn = this._key;
    const arr = this._last as T[];
    for (let i = 0; i < arr.length; i++) {
      if (keyFn(arr[i]!) === key) {
        arr.splice(i, 1);
        break;
      }
    }
    if (this._isSig) {
      (this._list as Signal<readonly T[]>).setQuiet(arr);
    } else {
      const ua = this._list as T[];
      for (let i = 0; i < ua.length; i++) {
        if (keyFn(ua[i]!) === key) {
          ua.splice(i, 1);
          break;
        }
      }
    }
  }

  dispose(): void {
    if (this._sub !== null) {
      (this._list as Signal<readonly T[]>).$unsub(this._sub);
      this._sub = null;
    }
    this._clearAll();
    if (this._isSig) (this._list as Signal<readonly T[]>).setQuiet([]);
    this._mounted = false;
  }

  /* ---------------------------------------------------------------- */
  /* internals                                                         */
  /* ---------------------------------------------------------------- */

  private _create(item: T): RowEntry<T> {
    const prev = owner.current;
    owner.current = this._ctx;
    let r: Node;
    try {
      r = this._render(item);
    } finally {
      owner.current = prev;
    }
    if (r instanceof ReFragment) {
      this._hasFr = true;
      return { root: r.root ?? r, fr: r, item };
    }
    return { root: r, fr: null, item };
  }

  /** Deferred directive mounts (nested each) run after final placement. */
  private _runMounts(e: RowEntry<T>): void {
    const fr = e.fr;
    if (fr !== null && fr.mounts !== null) {
      const m = fr.mounts;
      fr.mounts = null;
      for (let i = 0; i < m.length; i++) m[i]!();
    }
  }

  private _appendAll(items: readonly T[]): void {
    const key = this._key;
    const map = this._map;
    const parent = this._pn;
    const gp = parent.parentNode;
    // Vanilla-grade fast build: when the container is empty (anchor only) and
    // we are inserting a batch, detach it first — DOM inserts into a detached
    // subtree skip layout/pointer work entirely (mirrors the reference impl).
    const detached =
      gp !== null &&
      items.length >= 32 &&
      (parent as Node).isConnected === true &&
      parent.firstChild === this.anchor &&
      parent.lastChild === this.anchor;
    const ref = detached ? parent.nextSibling : null;
    if (detached) gp.removeChild(parent);

    const stage = detached ? null : document.createDocumentFragment();
    const target: ParentNode = detached ? parent : stage!;
    // Rows that produced fragments are tracked lazily: tracking every row
    // (alloc + push + no-op mount call per row) showed up in batch hot paths.
    let frRows: RowEntry<T>[] | null = null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const e = this._create(item);
      map.set(key(item), e);
      target.appendChild(e.root);
      if (e.fr !== null) (frRows ??= []).push(e);
    }
    if (detached) {
      gp.insertBefore(parent, ref);
    } else {
      parent.insertBefore(stage!, null);
    }
    if (frRows !== null) {
      // deferred directive mounts (nested each) run after final placement
      for (let i = 0; i < frRows.length; i++) this._runMounts(frRows[i]!);
    }
  }

  private _replaceAll(next: readonly T[]): void {
    const map = this._map;
    const parent = this._pn;
    const key = this._key;
    const existing = map.size;
    // Fast clear+insert in one call when the parent only holds our rows.
    const ownedOnly =
      parent.childNodes.length === existing + 1 && this.anchor.parentNode === parent;
    if (this._hasFr) {
      for (const [, e] of map) e.fr?.dispose();
    }
    if (!ownedOnly) {
      for (const [, e] of map) {
        if (e.root.parentNode === parent) (e.root as ChildNode).remove();
      }
    }
    map.clear();
    const gp = ownedOnly ? parent.parentNode : null;
    // Detach-container fast build (same trick as the reference impl's append):
    // destroy old rows and build new ones inside the detached container, then
    // reinsert it — one layout invalidation total.
    const detached =
      ownedOnly && gp !== null && next.length >= 32 && (parent as Node).isConnected === true;
    const ref = detached ? parent.nextSibling : null;
    if (detached) gp!.removeChild(parent);
    if (detached) parent.replaceChildren(this.anchor);
    const stage = detached ? null : document.createDocumentFragment();
    const target: ParentNode = detached ? parent : stage!;
    for (let i = 0; i < next.length; i++) {
      const item = next[i]!;
      const e = this._create(item);
      map.set(key(item), e);
      target.appendChild(e.root);
    }
    if (ownedOnly) {
      if (!detached) parent.replaceChildren(this.anchor, stage);
    } else {
      parent.insertBefore(stage!, null);
    }
    if (detached) gp!.insertBefore(parent, ref);
  }

  private _clearAll(): void {
    const map = this._map;
    const parent = this._pn;
    // Fast path: parent holds exactly our rows + anchor -> one replaceChildren
    // (node destruction dominates; detaching showed no gain for this op).
    if (parent.childNodes.length === map.size + 1 && this.anchor.parentNode === parent) {
      if (this._hasFr) {
        for (const [, e] of map) e.fr?.dispose();
      }
      parent.replaceChildren(this.anchor);
    } else {
      for (const [, e] of map) {
        e.fr?.dispose();
        (e.root as ChildNode).remove();
      }
    }
    map.clear();
    this._hasFr = false;
  }
}

function isSig(v: unknown): v is Signal<unknown> {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as Signal<unknown>).peek === 'function' &&
    typeof (v as Signal<unknown>).$sub === 'function'
  );
}

/* ------------------------------------------------------------------ */
/* directive                                                           */
/* ------------------------------------------------------------------ */

export interface EachDirective<T> {
  readonly _$each: true;
  /** mounted view (null before mount) */
  _view: KeyedView<T> | null;
  _mount(anchor: Node): KeyedView<T>;
  /** reactive/manual sync: reconcile list contents into the DOM */
  sync(next: readonly T[]): void;
  /** O(1): root node for a key (for targeted class/style toggles). */
  ref(key: unknown): Node | null;
  /** O(1): swap two rows by key. */
  swap(ka: unknown, kb: unknown): void;
  /** O(1): remove one row by key. */
  remove(key: unknown): void;
  readonly size: number;
}

export function each<T>(
  list: Signal<readonly T[]> | readonly T[],
  key: (item: T) => unknown,
  render: (item: T) => Node,
): EachDirective<T> {
  const dir: EachDirective<T> = {
    _$each: true,
    _view: null,
    _mount(anchor: Node): KeyedView<T> {
      const view = new KeyedView<T>(anchor, list, key, render);
      dir._view = view;
      return view;
    },
    sync(next: readonly T[]): void {
      dir._view?.sync(next);
    },
    ref(key: unknown): Node | null {
      return dir._view?.ref(key) ?? null;
    },
    swap(ka: unknown, kb: unknown): void {
      dir._view?.swap(ka, kb);
    },
    remove(key: unknown): void {
      dir._view?.remove(key);
    },
    get size(): number {
      return dir._view?.size ?? 0;
    },
  };
  return dir;
}

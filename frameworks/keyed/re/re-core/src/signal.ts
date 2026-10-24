/**
 * @re/core — fine-grained reactivity
 *
 * Design goals:
 *  - Zero dependencies, zero abstractions at runtime: a signal is a plain object
 *    with a `value` accessor. No classes, no proxies, no schedulers on the hot path.
 *  - Push-then-pull: signal writes notify DOM subscribers synchronously (fastest
 *    possible text/attr updates); computeds are lazy when unread, push-through
 *    when subscribed.
 *  - `batch()` defers notifications; effects re-run synchronously outside batches.
 *  - Erasable-only TypeScript (runs natively under node --test with type stripping).
 */

/** A reactive subscriber. `run` receives the new value for direct (DOM) subs. */
export interface Sub {
  run(v: unknown): void;
  /** Dependency owners this sub is subscribed to (for cleanup). */
  deps?: Set<ReOwner> | null;
}

/** Anything that can unsubscribe a sub from itself. */
export interface ReOwner {
  $unsub(s: Sub): void;
}

/** Minimal reactive surface consumed by template bindings. */
export interface Reactive<T> {
  get value(): T;
  $sub(s: Sub): void;
  $unsub(s: Sub): void;
}

export interface Computed<T> extends Reactive<T> {
  peek(): T;
}

export interface Signal<T> extends Reactive<T> {
  set value(v: T);
  peek(): T;
  /** Write without notifying subscribers (used by direct-DOM keyed ops). */
  setQuiet(v: T): void;
}

/* ------------------------------------------------------------------ */
/* internals                                                           */
/* ------------------------------------------------------------------ */

let active: Sub | null = null;
let batching = false;
let notifyDepth = 0;
const queue = new Map<Sub, unknown>();

const SIG: unique symbol = Symbol('re.signal');

/**
 * Creation-context marker: when a view renders a row it sets `owner.current`;
 * signals created during that render are marked `_own` = context, letting
 * bindings skip unsubscribe work that would be dead weight (both die together).
 */
export const owner: { current: object | null } = { current: null };

export function isSignal(v: unknown): v is Signal<unknown> {
  return typeof v === 'object' && v !== null && v instanceof SignalImpl;
}

function trackSub(subs: Sub[], dep: ReOwner, sub: Sub): void {
  const deps = sub.deps ?? (sub.deps = new Set());
  if (!deps.has(dep)) {
    deps.add(dep);
    subs.push(sub);
  }
}

function dropDeps(sub: Sub): void {
  const deps = sub.deps;
  if (deps) {
    for (const owner of deps) owner.$unsub(sub);
    sub.deps = null;
  }
}

function notify(subs: Sub[], v: unknown): void {
  for (let i = 0; i < subs.length; i++) subs[i]!.run(v);
}

/* ------------------------------------------------------------------ */
/* signal                                                              */
/* ------------------------------------------------------------------ */

/**
 * Class-based implementation: methods live on the prototype, instances carry
 * only (value, subs, owner) — minimizing per-row allocation cost for
 * per-cell reactive state at scale (10k+ cells).
 */
class SignalImpl<T> implements Signal<T> {
  [SIG]: number = 1;
  _own: object | null;
  _v: T;
  /** single-subscriber fast path (dominant case: one DOM binding) */
  _sub0: Sub | null = null;
  _subs: Sub[] | null = null;

  constructor(initial: T) {
    this._v = initial;
    this._own = owner.current;
  }

  get value(): T {
    const a = active;
    if (a !== null) {
      const deps = a.deps ?? (a.deps = new Set());
      if (!deps.has(this)) {
        deps.add(this);
        if (this._sub0 === null) this._sub0 = a;
        else if (this._subs === null) this._subs = [a];
        else this._subs.push(a);
      }
    }
    return this._v;
  }

  set value(nv: T) {
    if (Object.is(nv, this._v)) return;
    this._v = nv;
    const s0 = this._sub0;
    const subs = this._subs;
    if (s0 === null && subs === null) return;
    if (batching) {
      if (s0 !== null) queue.set(s0, nv);
      if (subs !== null) {
        for (let i = 0; i < subs.length; i++) queue.set(subs[i]!, nv);
      }
      return;
    }
    if (++notifyDepth > 150) {
      notifyDepth = 0;
      throw new Error('[re] signal update depth exceeded (circular update?)');
    }
    try {
      if (s0 !== null) s0.run(nv);
      if (subs !== null) notify(subs, nv);
    } finally {
      notifyDepth--;
    }
  }

  peek(): T {
    return this._v;
  }

  setQuiet(nv: T): void {
    this._v = nv;
  }

  $sub(s: Sub): void {
    if (this._sub0 === null) {
      this._sub0 = s;
    } else if (this._subs === null) {
      this._subs = [s];
    } else {
      this._subs.push(s);
    }
  }

  $unsub(s: Sub): void {
    if (this._sub0 === s) {
      this._sub0 = null;
      return;
    }
    const subs = this._subs;
    if (subs === null) return;
    const i = subs.indexOf(s);
    if (i >= 0) {
      const last = subs.pop()!;
      if (i < subs.length) subs[i] = last;
    }
  }
}

export function signal<T>(initial: T): Signal<T> {
  return new SignalImpl<T>(initial);
}

/* ------------------------------------------------------------------ */
/* computed                                                            */
/* ------------------------------------------------------------------ */

export function computed<T>(fn: () => T): Computed<T> {
  let v: T;
  let dirty = true;
  const subs: Sub[] = [];

  const self: Sub = {
    deps: null,
    run() {
      if (subs.length === 0) {
        dirty = true;
        return;
      }
      const old = v;
      recompute();
      if (!Object.is(v, old)) notify(subs, v);
    },
  };

  function recompute(): void {
    dropDeps(self);
    const prev = active;
    active = self;
    try {
      v = fn();
    } finally {
      active = prev;
      dirty = false;
    }
  }

  const me: Computed<T> = {
    get value() {
      if (active !== null) trackSub(subs, me, active);
      if (dirty) recompute();
      return v;
    },
    peek() {
      if (dirty) recompute();
      return v;
    },
    $sub(s: Sub) {
      subs.push(s);
    },
    $unsub(s: Sub) {
      const i = subs.indexOf(s);
      if (i >= 0) {
        const last = subs.pop()!;
        if (i < subs.length) subs[i] = last;
      }
    },
  };
  Object.defineProperty(me, SIG, { value: 1, enumerable: false });
  return me;
}

/* ------------------------------------------------------------------ */
/* effect / batch / untrack                                            */
/* ------------------------------------------------------------------ */

export function effect(fn: () => void): () => void {
  const e: Sub = {
    deps: null,
    run() {
      rerun();
    },
  };
  function rerun(): void {
    dropDeps(e);
    const prev = active;
    active = e;
    try {
      fn();
    } finally {
      active = prev;
    }
  }
  rerun();
  return () => {
    dropDeps(e);
  };
}

export function batch<T>(fn: () => T): T {
  if (batching) return fn();
  batching = true;
  try {
    return fn();
  } finally {
    batching = false;
    if (queue.size !== 0) {
      const q = Array.from(queue);
      queue.clear();
      for (const [sub, val] of q) sub.run(val);
    }
  }
}

export function untrack<T>(fn: () => T): T {
  const prev = active;
  active = null;
  try {
    return fn();
  } finally {
    active = prev;
  }
}

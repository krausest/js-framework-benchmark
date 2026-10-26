(() => {
  // re-core/src/signal.ts
  var active = null;
  var batching = false;
  var notifyDepth = 0;
  var queue = /* @__PURE__ */ new Map();
  var SIG = Symbol("re.signal");
  var owner = { current: null };
  function isSignal(v) {
    return typeof v === "object" && v !== null && v instanceof SignalImpl;
  }
  function dropDeps(sub) {
    const deps = sub.deps;
    if (deps) {
      for (const owner2 of deps) owner2.$unsub(sub);
      sub.deps = null;
    }
  }
  function notify(subs, v) {
    for (let i = 0; i < subs.length; i++) subs[i].run(v);
  }
  var SignalImpl = class {
    [SIG] = 1;
    _own;
    _v;
    /** single-subscriber fast path (dominant case: one DOM binding) */
    _sub0 = null;
    _subs = null;
    constructor(initial) {
      this._v = initial;
      this._own = owner.current;
    }
    get value() {
      const a = active;
      if (a !== null) {
        const deps = a.deps ?? (a.deps = /* @__PURE__ */ new Set());
        if (!deps.has(this)) {
          deps.add(this);
          if (this._sub0 === null) this._sub0 = a;
          else if (this._subs === null) this._subs = [a];
          else this._subs.push(a);
        }
      }
      return this._v;
    }
    set value(nv) {
      if (Object.is(nv, this._v)) return;
      this._v = nv;
      const s0 = this._sub0;
      const subs = this._subs;
      if (s0 === null && subs === null) return;
      if (batching) {
        if (s0 !== null) queue.set(s0, nv);
        if (subs !== null) {
          for (let i = 0; i < subs.length; i++) queue.set(subs[i], nv);
        }
        return;
      }
      if (++notifyDepth > 150) {
        notifyDepth = 0;
        throw new Error("[re] signal update depth exceeded (circular update?)");
      }
      try {
        if (s0 !== null) s0.run(nv);
        if (subs !== null) notify(subs, nv);
      } finally {
        notifyDepth--;
      }
    }
    peek() {
      return this._v;
    }
    setQuiet(nv) {
      this._v = nv;
    }
    $sub(s) {
      if (this._sub0 === null) {
        this._sub0 = s;
      } else if (this._subs === null) {
        this._subs = [s];
      } else {
        this._subs.push(s);
      }
    }
    $unsub(s) {
      if (this._sub0 === s) {
        this._sub0 = null;
        return;
      }
      const subs = this._subs;
      if (subs === null) return;
      const i = subs.indexOf(s);
      if (i >= 0) {
        const last = subs.pop();
        if (i < subs.length) subs[i] = last;
      }
    }
  };
  function signal(initial) {
    return new SignalImpl(initial);
  }
  function effect(fn) {
    const e = {
      deps: null,
      run() {
        rerun();
      }
    };
    function rerun() {
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

  // re-core/src/template.ts
  var T_TEXT = 0;
  var T_ATTR = 1;
  var T_PARTS = 2;
  var ReFragment = class extends DocumentFragment {
    root = null;
    disposers = null;
    mounts = null;
    dispose() {
      const d = this.disposers;
      if (d !== null) {
        this.disposers = null;
        for (let i = 0; i < d.length; i++) d[i]();
      }
    }
  };
  var cache = /* @__PURE__ */ new WeakMap();
  var precompiled = /* @__PURE__ */ new Map();
  var MARKER_RE = /\u0001(\d+)\u0002/g;
  var MARKER_FULL_RE = /^\u0001(\d+)\u0002$/;
  function joinHtml(strings) {
    let out = strings[0] ?? "";
    for (let i = 1; i < strings.length; i++) {
      out += "" + (i - 1) + "" + strings[i];
    }
    return out;
  }
  function walk(parent, base, slots) {
    let i = 0;
    const cn = parent.childNodes;
    while (i < cn.length) {
      const n = cn[i];
      const nt = n.nodeType;
      if (nt === 3) {
        const data = n.data;
        if (data.indexOf("") >= 0) {
          const frag = document.createDocumentFragment();
          const re = MARKER_RE;
          re.lastIndex = 0;
          let last = 0;
          let m;
          while ((m = re.exec(data)) !== null) {
            if (m.index > last) {
              frag.appendChild(document.createTextNode(data.slice(last, m.index)));
            }
            const j = frag.childNodes.length;
            frag.appendChild(document.createTextNode(""));
            const p = [...base, i + j];
            slots.push({ k: T_TEXT, i: +m[1], p });
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
        const el = n;
        const attrs = el.attributes;
        for (let a = 0; a < attrs.length; a++) {
          const attr = attrs[a];
          const val = attr.value;
          if (val.indexOf("") < 0) continue;
          const sm = MARKER_FULL_RE.exec(val);
          const p = [...base, i];
          if (sm !== null) {
            slots.push({ k: T_ATTR, i: +sm[1], n: attr.name, p });
          } else {
            const parts = [];
            const re2 = MARKER_RE;
            re2.lastIndex = 0;
            let last = 0;
            let m2;
            while ((m2 = re2.exec(val)) !== null) {
              if (m2.index > last) parts.push(val.slice(last, m2.index));
              parts.push(+m2[1]);
              last = m2.index + m2[0].length;
            }
            if (last < val.length) parts.push(val.slice(last));
            slots.push({ k: T_PARTS, n: attr.name, parts, p });
          }
        }
        if (el.tagName === "TEMPLATE") {
          walk(el.content, [...base, i], slots);
        } else {
          walk(el, [...base, i], slots);
        }
      }
      i++;
    }
  }
  function buildContent(htmlStr) {
    const el = document.createElement("template");
    el.innerHTML = htmlStr;
    return el.content;
  }
  function normalizeContent(parent) {
    let i = 0;
    const cn = parent.childNodes;
    while (i < cn.length) {
      const n = cn[i];
      const nt = n.nodeType;
      if (nt === 3) {
        const data = n.data;
        if (data.indexOf("") >= 0) {
          const frag = document.createDocumentFragment();
          const re = MARKER_RE;
          re.lastIndex = 0;
          let last = 0;
          let m;
          while ((m = re.exec(data)) !== null) {
            if (m.index > last) {
              frag.appendChild(document.createTextNode(data.slice(last, m.index)));
            }
            frag.appendChild(document.createTextNode(""));
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
        const el = n;
        if (el.tagName === "TEMPLATE") {
          normalizeContent(el.content);
        } else {
          normalizeContent(el);
        }
      }
      i++;
    }
  }
  function compile(strings) {
    const content = buildContent(joinHtml(strings));
    const slots = [];
    walk(content, [], slots);
    return { content, slots };
  }
  function buildCompiled(strings, slots) {
    const content = buildContent(joinHtml(strings));
    normalizeContent(content);
    return { content, slots };
  }
  function fmt(v) {
    if (typeof v === "string") return v;
    if (v == null) return "";
    return String(v);
  }
  function setPropOrAttr(el, name, v) {
    if (name === "class") {
      el.className = fmt(v);
      return;
    }
    if (name === "style") {
      el.style.cssText = fmt(v);
      return;
    }
    if (name in el) {
      try {
        el[name] = v;
        return;
      } catch {
      }
    }
    el.setAttribute(name, fmt(v));
  }
  function wireAttr(el, name, v, frag) {
    if (typeof v === "function") {
      if (name.charCodeAt(0) === 111 && name.charCodeAt(1) === 110) {
        if (name in el) {
          el[name] = v;
        } else {
          el.addEventListener(name.slice(2), v);
        }
      } else if (name === "ref") {
        v(el);
      } else {
        setPropOrAttr(el, name, v);
      }
      return;
    }
    if (isSignal(v)) {
      const sub = {
        run(nv) {
          setPropOrAttr(el, name, nv);
        }
      };
      setPropOrAttr(el, name, v.value);
      v.$sub(sub);
      if (v._own !== owner.current) {
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
  function instantiate(c, vals) {
    const frag = new ReFragment();
    const clone = c.content.cloneNode(true);
    while (clone.firstChild !== null) frag.appendChild(clone.firstChild);
    frag.root = frag.firstChild;
    const slots = c.slots;
    for (let s = 0; s < slots.length; s++) {
      const slot = slots[s];
      let node = frag;
      const p = slot.p;
      for (let k = 0; k < p.length; k++) node = node.childNodes[p[k]];
      if (slot.k === T_TEXT) {
        const t = node;
        const v = vals[slot.i];
        if (isSignal(v)) {
          t.data = fmt(v.value);
          const sub = {
            run(nv) {
              t.data = fmt(nv);
            }
          };
          v.$sub(sub);
          if (v._own !== owner.current) {
            const sig = v;
            if (frag.disposers === null) frag.disposers = [];
            frag.disposers.push(() => {
              sig.$unsub(sub);
            });
          }
        } else if (typeof v === "function") {
          if (frag.disposers === null) frag.disposers = [];
          frag.disposers.push(
            effect(() => {
              t.data = fmt(v());
            })
          );
        } else if (v !== null && typeof v === "object") {
          const eachDir = v;
          if (eachDir._$each === true) {
            const view = eachDir._mount(t);
            if (frag.mounts === null) frag.mounts = [];
            frag.mounts.push(() => view.mount());
            if (frag.disposers === null) frag.disposers = [];
            frag.disposers.push(() => view.dispose());
          } else if (v instanceof Node) {
            t.parentNode.insertBefore(v, t);
            t.remove();
            if (v instanceof ReFragment) {
              if (v.mounts !== null) {
                if (frag.mounts === null) frag.mounts = [];
                for (let k = 0; k < v.mounts.length; k++) frag.mounts.push(v.mounts[k]);
              }
              if (v.disposers !== null) {
                if (frag.disposers === null) frag.disposers = [];
                for (let k = 0; k < v.disposers.length; k++) frag.disposers.push(v.disposers[k]);
              }
            }
          } else {
            throw new Error("[re] unsupported child binding type: " + v.constructor?.name);
          }
        } else {
          t.data = fmt(v);
        }
      } else if (slot.k === T_ATTR) {
        wireAttr(node, slot.n, vals[slot.i], frag);
      } else {
        const el = node;
        const name = slot.n;
        const parts = slot.parts;
        if (frag.disposers === null) frag.disposers = [];
        frag.disposers.push(
          effect(() => {
            let out = "";
            for (let j = 0; j < parts.length; j++) {
              const part = parts[j];
              if (typeof part === "number") {
                const pv = vals[part];
                out += isSignal(pv) ? fmt(pv.value) : fmt(pv);
              } else {
                out += part;
              }
            }
            setPropOrAttr(el, name, out);
          })
        );
      }
    }
    return frag;
  }
  function html(strings, ...vals) {
    let compiled = cache.get(strings);
    if (compiled === void 0) {
      const pre = precompiled.get(strings.join("\0"));
      compiled = pre !== void 0 ? buildCompiled(strings, pre) : compile(strings);
      cache.set(strings, compiled);
    }
    return instantiate(compiled, vals);
  }
  function append(parent, ...nodes) {
    const pending = [];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n === null || n === void 0 || n === false) continue;
      parent.appendChild(n);
      if (n instanceof ReFragment) {
        const m = n.mounts;
        if (m !== null) {
          for (let k = 0; k < m.length; k++) pending.push(m[k]);
        }
      }
    }
    for (let i = 0; i < pending.length; i++) pending[i]();
  }

  // re-core/src/each.ts
  var KeyedView = class {
    anchor;
    _list;
    _isSig;
    _key;
    _render;
    _map = /* @__PURE__ */ new Map();
    _last = [];
    _sub = null;
    _mounted = false;
    /** true once any row produced a ReFragment (disposers needed on teardown) */
    _hasFr = false;
    /** creation-context token: signals born during row render die with the row */
    _ctx = {};
    constructor(anchor2, list, key, render) {
      this.anchor = anchor2;
      this._list = list;
      this._isSig = isSig(list);
      this._key = key;
      this._render = render;
    }
    /** The anchor's real parent, resolved lazily — never stale. */
    get _pn() {
      return this.anchor.parentNode;
    }
    /** Called once the anchor is in its final parent (via append()/mount()). */
    mount() {
      if (this._mounted) return;
      this._mounted = true;
      const parent = this.anchor.parentNode;
      if (parent !== null) {
        let c = parent.firstChild;
        while (c !== null) {
          const next = c.nextSibling;
          if (c !== this.anchor && c.nodeType === 3 && c.data.trim() === "") {
            parent.removeChild(c);
          }
          c = next;
        }
      }
      const initial = this._isSig ? this._list.peek() : this._list;
      if (this._isSig) {
        const view = this;
        this._sub = {
          run(v) {
            view.sync(v);
          }
        };
        this._list.$sub(this._sub);
      }
      this.sync(initial);
    }
    /* ---------------------------------------------------------------- */
    /* reactive sync (declarative path)                                  */
    /* ---------------------------------------------------------------- */
    sync(next) {
      if (!this._mounted) this.mount();
      const old = this._last;
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
      if (next.length > old.length) {
        let prefix = true;
        for (let i = 0; i < old.length; i++) {
          if (key(old[i]) !== key(next[i])) {
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
      let common = false;
      const map = this._map;
      for (let i = 0; i < next.length; i++) {
        if (map.has(key(next[i]))) {
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
    _commit(next) {
      this._last = this._isSig ? next : next.slice();
    }
    _diff(next) {
      const map = this._map;
      const parent = this._pn;
      const key = this._key;
      const nextKeys = /* @__PURE__ */ new Set();
      for (let i = 0; i < next.length; i++) nextKeys.add(key(next[i]));
      if (map.size !== 0) {
        for (const [k, e] of map) {
          if (!nextKeys.has(k)) {
            e.fr?.dispose();
            e.root.remove();
            map.delete(k);
          }
        }
      }
      let ref = this.anchor;
      for (let i = 0; i < next.length; i++) {
        const item = next[i];
        const k = key(item);
        let e = map.get(k);
        if (e === void 0) {
          e = this._create(item);
          map.set(k, e);
        }
        const r = e.root;
        if (ref.nextSibling !== r) parent.insertBefore(r, ref.nextSibling);
        this._runMounts(e);
        ref = r;
      }
    }
    /* ---------------------------------------------------------------- */
    /* O(1) direct ops (imperative path)                                 */
    /* ---------------------------------------------------------------- */
    ref(key) {
      return this._map.get(key)?.root ?? null;
    }
    get size() {
      return this._map.size;
    }
    /** Swap two rows by key in O(1). Updates the source list quietly. */
    swap(ka, kb) {
      if (ka === kb) return;
      const ea = this._map.get(ka);
      const eb = this._map.get(kb);
      if (ea === void 0 || eb === void 0) return;
      if (!this._mounted) this.mount();
      const a = ea.root;
      const b = eb.root;
      const bFollows = (a.compareDocumentPosition(b) & 4) !== 0;
      const x = bFollows ? a : b;
      const y = bFollows ? b : a;
      const parent = this._pn;
      const yNext = y.nextSibling;
      parent.insertBefore(y, x);
      parent.insertBefore(x, yNext);
      this._applyListSwap(ka, kb);
    }
    _applyListSwap(ka, kb) {
      const key = this._key;
      const arr = this._last;
      let ia = -1;
      let ib = -1;
      for (let i = 0; i < arr.length; i++) {
        const k = key(arr[i]);
        if (k === ka) ia = i;
        else if (k === kb) ib = i;
        if (ia >= 0 && ib >= 0) break;
      }
      if (ia >= 0 && ib >= 0) {
        const tmp = arr[ia];
        arr[ia] = arr[ib];
        arr[ib] = tmp;
        if (this._isSig) {
          this._list.setQuiet(arr);
        } else {
          const ua = this._list;
          let ja = -1;
          let jb = -1;
          for (let i = 0; i < ua.length; i++) {
            const k = key(ua[i]);
            if (k === ka) ja = i;
            else if (k === kb) jb = i;
            if (ja >= 0 && jb >= 0) break;
          }
          if (ja >= 0 && jb >= 0) {
            const t2 = ua[ja];
            ua[ja] = ua[jb];
            ua[jb] = t2;
          }
        }
      }
    }
    /** Remove one row by key in O(1). Updates the source list quietly. */
    remove(key) {
      const e = this._map.get(key);
      if (e === void 0) return;
      if (!this._mounted) this.mount();
      e.fr?.dispose();
      e.root.remove();
      this._map.delete(key);
      const keyFn = this._key;
      const arr = this._last;
      for (let i = 0; i < arr.length; i++) {
        if (keyFn(arr[i]) === key) {
          arr.splice(i, 1);
          break;
        }
      }
      if (this._isSig) {
        this._list.setQuiet(arr);
      } else {
        const ua = this._list;
        for (let i = 0; i < ua.length; i++) {
          if (keyFn(ua[i]) === key) {
            ua.splice(i, 1);
            break;
          }
        }
      }
    }
    dispose() {
      if (this._sub !== null) {
        this._list.$unsub(this._sub);
        this._sub = null;
      }
      this._clearAll();
      if (this._isSig) this._list.setQuiet([]);
      this._mounted = false;
    }
    /* ---------------------------------------------------------------- */
    /* internals                                                         */
    /* ---------------------------------------------------------------- */
    _create(item) {
      const prev = owner.current;
      owner.current = this._ctx;
      let r;
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
    _runMounts(e) {
      const fr = e.fr;
      if (fr !== null && fr.mounts !== null) {
        const m = fr.mounts;
        fr.mounts = null;
        for (let i = 0; i < m.length; i++) m[i]();
      }
    }
    _appendAll(items) {
      const key = this._key;
      const map = this._map;
      const parent = this._pn;
      const gp = parent.parentNode;
      const detached = gp !== null && items.length >= 32 && parent.isConnected === true && parent.firstChild === this.anchor && parent.lastChild === this.anchor;
      const ref = detached ? parent.nextSibling : null;
      if (detached) gp.removeChild(parent);
      const stage = detached ? null : document.createDocumentFragment();
      const target = detached ? parent : stage;
      const created = detached ? [] : null;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const e = this._create(item);
        map.set(key(item), e);
        target.appendChild(e.root);
        if (created !== null) created.push(e);
      }
      if (detached) {
        gp.insertBefore(parent, ref);
        for (let i = 0; i < created.length; i++) this._runMounts(created[i]);
      } else {
        parent.insertBefore(stage, null);
      }
    }
    _replaceAll(next) {
      const map = this._map;
      const parent = this._pn;
      const key = this._key;
      const existing = map.size;
      const ownedOnly = parent.childNodes.length === existing + 1 && this.anchor.parentNode === parent;
      if (this._hasFr) {
        for (const [, e] of map) e.fr?.dispose();
      }
      if (!ownedOnly) {
        for (const [, e] of map) {
          if (e.root.parentNode === parent) e.root.remove();
        }
      }
      map.clear();
      const gp = ownedOnly ? parent.parentNode : null;
      const detached = ownedOnly && gp !== null && next.length >= 32 && parent.isConnected === true;
      const ref = detached ? parent.nextSibling : null;
      if (detached) gp.removeChild(parent);
      if (detached) parent.replaceChildren(this.anchor);
      const stage = detached ? null : document.createDocumentFragment();
      const target = detached ? parent : stage;
      for (let i = 0; i < next.length; i++) {
        const item = next[i];
        const e = this._create(item);
        map.set(key(item), e);
        target.appendChild(e.root);
      }
      if (ownedOnly) {
        if (!detached) parent.replaceChildren(this.anchor, stage);
      } else {
        parent.insertBefore(stage, null);
      }
      if (detached) gp.insertBefore(parent, ref);
    }
    _clearAll() {
      const map = this._map;
      const parent = this._pn;
      if (parent.childNodes.length === map.size + 1 && this.anchor.parentNode === parent) {
        if (this._hasFr) {
          for (const [, e] of map) e.fr?.dispose();
        }
        parent.replaceChildren(this.anchor);
      } else {
        for (const [, e] of map) {
          e.fr?.dispose();
          e.root.remove();
        }
      }
      map.clear();
      this._hasFr = false;
    }
  };
  function isSig(v) {
    return typeof v === "object" && v !== null && typeof v.peek === "function" && typeof v.$sub === "function";
  }
  function each(list, key, render) {
    const dir = {
      _$each: true,
      _view: null,
      _mount(anchor2) {
        const view = new KeyedView(anchor2, list, key, render);
        dir._view = view;
        return view;
      },
      sync(next) {
        dir._view?.sync(next);
      },
      ref(key2) {
        return dir._view?.ref(key2) ?? null;
      },
      swap(ka, kb) {
        dir._view?.swap(ka, kb);
      },
      remove(key2) {
        dir._view?.remove(key2);
      },
      get size() {
        return dir._view?.size ?? 0;
      }
    };
    return dir;
  }

  // src/trace.ts
  function _random(max) {
    return Math.round(Math.random() * 1e3) % max;
  }
  var ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
  var COLOURS = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
  var NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
  var idSeq = 1;
  function buildData(count) {
    const data = new Array(count);
    for (let i = 0; i < count; i++) {
      data[i] = {
        id: idSeq++,
        label: ADJECTIVES[_random(ADJECTIVES.length)] + " " + COLOURS[_random(COLOURS.length)] + " " + NOUNS[_random(NOUNS.length)],
        t: null
      };
    }
    return data;
  }
  var tbodyEl0 = document.getElementById("tbody");
  var tbody = tbodyEl0;
  var table = tbody.parentElement;
  var anchor = document.createComment("each");
  tbody.appendChild(anchor);
  var protoTr = (() => {
    const f = html`<tr><td class="col-md-1">${""}</td><td class="col-md-4"><a>${""}</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;
    return f.root;
  })();
  {
    const rows = signal([]);
    const warmBody = document.createElement("tbody");
    const list = each(rows, (r) => r.id, (r) => {
      const tr = protoTr.cloneNode(true);
      tr.data_id = r.id;
      tr.childNodes[0].firstChild.data = String(r.id);
      r.t = tr.childNodes[1].firstChild.firstChild;
      r.t.data = r.label;
      return tr;
    });
    append(warmBody, html`${list}`);
    rows.value = buildData(10);
    rows.value = [];
  }
  var T0 = { data: 0, render: 0, parse: 0, map: 0, insert: 0, total: 0, layout: 0 };
  var now = () => performance.now();
  var gcAvail = window.gc;
  var gcNow = () => {
    try {
      gcAvail?.();
    } catch {
    }
  };
  var raf2 = () => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
  function dropRowsKeepAnchor() {
    tbody.replaceChildren(anchor);
  }
  function aCurNodes(items, st) {
    let t = now();
    st.data = now() - t;
    t = now();
    const out = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const r = items[i];
      const tr = protoTr.cloneNode(true);
      tr.data_id = r.id;
      tr.childNodes[0].firstChild.data = String(r.id);
      r.t = tr.childNodes[1].firstChild.firstChild;
      r.t.data = r.label;
      out[i] = tr;
    }
    st.render = now() - t;
    st.parse = 0;
    t = now();
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < items.length; i++) {
      const r = items[i];
      map.set(r.id, { root: out[i], fr: null, item: r });
    }
    st.map = now() - t;
    t = now();
    const gp = tbody.parentNode;
    const ref = tbody.nextSibling;
    gp.removeChild(tbody);
    tbody.replaceChildren(anchor);
    for (let i = 0; i < out.length; i++) tbody.appendChild(out[i]);
    gp.insertBefore(tbody, ref);
    st.insert = now() - t;
  }
  var scratch = document.createElement("tbody");
  function eFusedRun(items, st) {
    let t = now();
    const count = 1e3;
    const data = new Array(count);
    const parts = new Array(count);
    for (let i = 0; i < count; i++) {
      const id = idSeq++;
      const label = ADJECTIVES[_random(ADJECTIVES.length)] + " " + COLOURS[_random(COLOURS.length)] + " " + NOUNS[_random(NOUNS.length)];
      const r = { id, label, t: null };
      data[i] = r;
      parts[i] = `<tr data_id="${id}"><td class="col-md-1">${id}</td><td class="col-md-4"><a>${label}</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;
    }
    st.data = now() - t;
    t = now();
    const htmlStr = parts.join("");
    st.render = now() - t;
    t = now();
    scratch.innerHTML = htmlStr;
    st.parse = now() - t;
    t = now();
    const n = count;
    const out = new Array(n);
    const kids = scratch.children;
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < n; i++) {
      const r = data[i];
      const root = kids[i];
      out[i] = root;
      map.set(r.id, { root, fr: null, item: r });
    }
    st.map = now() - t;
    t = now();
    const gp = tbody.parentNode;
    const ref = tbody.nextSibling;
    gp.removeChild(tbody);
    tbody.replaceChildren(anchor, ...out);
    gp.insertBefore(tbody, ref);
    st.insert = now() - t;
    return data;
  }
  var rowTemplate = document.createElement("tr");
  rowTemplate.innerHTML = "<td class='col-md-1'> </td><td class='col-md-4'><a> </a></td><td class='col-md-1'><a><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";
  function vVanillaRun(items, st) {
    let t = now();
    st.data = now() - t;
    t = now();
    tbody.textContent = "";
    tbody.appendChild(anchor);
    const empty = true;
    const gp = tbody.parentNode;
    const ref = tbody.nextSibling;
    tbody.remove();
    const out = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const d = items[i];
      const tr = rowTemplate.cloneNode(true);
      const td1 = tr.firstChild;
      const a2 = td1.nextSibling.firstChild;
      tr.data_id = d.id;
      td1.firstChild.nodeValue = String(d.id);
      a2.firstChild.nodeValue = d.label;
      tbody.appendChild(tr);
      out[i] = tr;
    }
    st.render = now() - t;
    st.parse = 0;
    st.map = 0;
    t = now();
    empty && gp.insertBefore(tbody, ref);
    st.insert = now() - t;
  }
  function hSwapClear(st) {
    let t = now();
    const fresh = tbody.cloneNode(false);
    fresh.appendChild(anchor);
    tbody.replaceWith(fresh);
    tbody = fresh;
    st.insert = now() - t;
    st.render = 0;
    st.parse = 0;
    st.map = 0;
    st.data = 0;
  }
  function hCurClear(st) {
    let t = now();
    tbody.replaceChildren(anchor);
    st.insert = now() - t;
    st.render = 0;
    st.parse = 0;
    st.map = 0;
    st.data = 0;
  }
  function jFusedRun(items, st) {
    let t = now();
    st.data = now() - t;
    t = now();
    const gp = tbody.parentNode;
    const ref = tbody.nextSibling;
    gp.removeChild(tbody);
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < items.length; i++) {
      const r = items[i];
      const tr = protoTr.cloneNode(true);
      tr.data_id = r.id;
      tr.childNodes[0].firstChild.data = String(r.id);
      r.t = tr.childNodes[1].firstChild.firstChild;
      r.t.data = r.label;
      map.set(r.id, { root: tr, fr: null, item: r });
      tbody.appendChild(tr);
    }
    st.render = now() - t;
    st.parse = 0;
    st.map = 0;
    t = now();
    gp.insertBefore(tbody, ref);
    st.insert = now() - t;
  }
  function kLeanRun(items, st) {
    let t = now();
    st.data = now() - t;
    t = now();
    const gp = tbody.parentNode;
    const ref = tbody.nextSibling;
    const fresh = tbody.cloneNode(false);
    fresh.appendChild(anchor);
    gp.removeChild(tbody);
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < items.length; i++) {
      const r = items[i];
      const tr = protoTr.cloneNode(true);
      tr.data_id = r.id;
      const td1 = tr.firstChild;
      const a2 = td1.nextSibling.firstChild;
      td1.firstChild.data = String(r.id);
      a2.firstChild.data = r.label;
      map.set(r.id, tr);
      fresh.appendChild(tr);
    }
    st.render = now() - t;
    st.parse = 0;
    st.map = 0;
    t = now();
    gp.insertBefore(fresh, ref);
    tbody = fresh;
    st.insert = now() - t;
  }
  var variants = [
    { name: "A_cur", create: aCurNodes, replace: aCurNodes },
    { name: "K_lean", create: kLeanRun, replace: kLeanRun },
    { name: "J_fused", ops: ["create"], create: jFusedRun, replace: jFusedRun },
    { name: "V_vanilla", create: vVanillaRun, replace: vVanillaRun }
  ];
  var N = 50;
  var WARM = 6;
  function med(xs) {
    const s = [...xs].sort((a, b) => a - b);
    return s[s.length >> 1];
  }
  function p90(xs) {
    const s = [...xs].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, s.length * 0.9 | 0)];
  }
  function aggregate(rows, layouts) {
    const totals = rows.map((r) => r.total);
    const stageKeys = ["data", "render", "parse", "map", "insert"];
    const stages = {};
    for (const k of stageKeys) stages[k] = +med(rows.map((r) => r[k])).toFixed(3);
    stages["layout"] = +med(layouts).toFixed(3);
    return {
      n: rows.length,
      total: { min: +Math.min(...totals).toFixed(3), med: +med(totals).toFixed(3), p90: +p90(totals).toFixed(3) },
      stages
    };
  }
  async function benchVariant(v, op, pass) {
    const rows = [];
    const layouts = [];
    dropRowsKeepAnchor();
    if (op === "replace") {
      const pre = buildData(1e3);
      const st = { ...T0 };
      v.create(pre, st);
    }
    await raf2();
    for (let i = 0; i < WARM; i++) {
      const st = { ...T0 };
      const items = buildData(1e3);
      if (op === "create") v.create(items, st);
      else v.replace(items, st);
      if (op === "create") dropRowsKeepAnchor();
      await raf2();
    }
    for (let i = 0; i < N; i++) {
      gcNow();
      await raf2();
      const st = { ...T0 };
      let items;
      const t0 = now();
      if (v.fused && op === "create") {
        items = eFusedRun(void 0, st);
      } else {
        items = buildData(1e3);
        st.data = now() - t0;
        if (op === "create") v.create(items, st);
        else v.replace(items, st);
      }
      st.total = now() - t0;
      const tl = now();
      await raf2();
      st.layout = now() - tl;
      rows.push(st);
      layouts.push(st.layout);
      if (op === "create") dropRowsKeepAnchor();
    }
    await raf2();
    return { rows, layouts };
  }
  async function benchE(op) {
    const rows = [];
    const layouts = [];
    const setup = () => {
      dropRowsKeepAnchor();
      if (op === "replace") eFusedRun(void 0, { ...T0 });
    };
    setup();
    await raf2();
    for (let i = 0; i < WARM; i++) {
      eFusedRun(void 0, { ...T0 });
      if (op === "create") dropRowsKeepAnchor();
      await raf2();
    }
    for (let i = 0; i < N; i++) {
      gcNow();
      await raf2();
      const st = { ...T0 };
      const t0 = now();
      eFusedRun(void 0, st);
      st.total = now() - t0;
      const tl = now();
      await raf2();
      st.layout = now() - tl;
      rows.push(st);
      layouts.push(st.layout);
      if (op === "create") dropRowsKeepAnchor();
    }
    await raf2();
    return { rows, layouts };
  }
  async function runAll() {
    const out = {};
    const bucket = {};
    const layoutBucket = {};
    for (const v of variants) {
      bucket[v.name] = { create: [], replace: [] };
      layoutBucket[v.name] = { create: [], replace: [] };
    }
    bucket["E_fused"] = { create: [], replace: [] };
    layoutBucket["E_fused"] = { create: [], replace: [] };
    const order = variants.map((v) => v.name);
    const passes = [order, [...order].reverse()];
    for (let p = 0; p < passes.length; p++) {
      for (const name of passes[p]) {
        const ops = variants.find((v) => v.name === name)?.ops ?? ["create", "replace"];
        for (const op of ops) {
          console.log("trace: pass", p, name, op, "begin", performance.now().toFixed(0));
          const r = name === "E_fused" ? await benchE(op) : await benchVariant(variants.find((v) => v.name === name), op, p);
          console.log("trace: pass", p, name, op, "done", performance.now().toFixed(0));
          bucket[name][op].push(...r.rows);
          layoutBucket[name][op].push(...r.layouts);
          (out[name] ??= {})[op] = aggregate(r.rows, r.layouts);
          await new Promise((res) => setTimeout(res, 20));
        }
      }
    }
    for (const name of Object.keys(bucket)) {
      for (const op of ["create", "replace"]) {
        if (bucket[name][op].length > 0) {
          out[name][op + "_all"] = aggregate(bucket[name][op], layoutBucket[name][op]);
        }
      }
    }
    const clearAgg = {};
    for (const count of [1e3, 1e4]) {
      const cur = [];
      const swp = [];
      for (let i = 0; i < WARM; i++) {
        dropRowsKeepAnchor();
        prefill(count);
      }
      await raf2();
      for (let i = 0; i < N; i++) {
        dropRowsKeepAnchor();
        prefill(count);
        gcNow();
        await raf2();
        const s1 = { ...T0 };
        hCurClear(s1);
        cur.push(s1.insert);
        dropRowsKeepAnchor();
        prefill(count);
        await raf2();
        const s2 = { ...T0 };
        hSwapClear(s2);
        swp.push(s2.insert);
      }
      await raf2();
      clearAgg["n" + count] = { cur: +med(cur).toFixed(3), swap: +med(swp).toFixed(3) };
    }
    out["__clearAB"] = clearAgg;
    return out;
  }
  var btn = document.createElement("button");
  btn.id = "start";
  btn.textContent = "run trace";
  document.body.prepend(btn);
  function prefill(count) {
    for (let i = 0; i < count; i++) {
      const tr = protoTr.cloneNode(true);
      tr.childNodes[0].firstChild.data = String(i);
      tr.childNodes[1].firstChild.firstChild.textContent = "row " + i;
      tbody.appendChild(tr);
    }
  }
  btn.onclick = async () => {
    const r = await runAll();
    const pre = document.createElement("pre");
    pre.id = "result";
    pre.textContent = JSON.stringify(r);
    document.body.appendChild(pre);
  };
})();

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// signal.js
var signal;
var effect;
var untracked;
var batch;
var computed;
function use(s) {
  signal = s.signal;
  effect = s.effect;
  computed = s.computed;
  batch = s.batch || ((fn) => fn());
  untracked = s.untracked || batch;
}

// store.js
var _signals = Symbol("signals");
var _change = Symbol("length");
function store(values) {
  if (!values)
    return values;
  if (values[_signals])
    return values;
  if (Array.isArray(values))
    return list(values);
  if (values.constructor !== Object)
    return values;
  let signals = {}, _len = signal(Object.values(values).length);
  const state = new Proxy(signals, {
    get: (_, key) => key === _change ? _len : key === _signals ? signals : signals[key]?.valueOf(),
    set: (_, key, v, s) => (s = signals[key], set(signals, key, v), s || ++_len.value),
    deleteProperty: (_, key) => (signals[key] && (del(signals, key), _len.value--), 1),
    ownKeys() {
      _len.value;
      return Reflect.ownKeys(signals);
    }
  });
  for (let key in values) {
    const desc = Object.getOwnPropertyDescriptor(values, key);
    if (desc?.get) {
      (signals[key] = computed(desc.get.bind(state)))._set = desc.set?.bind(state);
    } else {
      signals[key] = null;
      set(signals, key, values[key]);
    }
  }
  return state;
}
function list(values) {
  let lastProp;
  if (values[_signals])
    return values;
  let _len = signal(values.length), signals = Array(values.length).fill(null);
  const state = new Proxy(signals, {
    get(_, key) {
      if (typeof key === "symbol")
        return key === _change ? _len : key === _signals ? signals : signals[key];
      if (key === "length")
        return Array.prototype[lastProp] ? _len.peek() : _len.value;
      lastProp = key;
      if (signals[key])
        return signals[key].valueOf();
      if (key < signals.length)
        return (signals[key] = signal(store(values[key]))).value;
    },
    set(_, key, v) {
      if (key === "length") {
        for (let i = v, l = signals.length; i < l; i++)
          delete state[i];
        _len.value = signals.length = v;
        return true;
      }
      set(signals, key, v);
      if (key >= _len.peek())
        _len.value = signals.length = Number(key) + 1;
      return true;
    },
    deleteProperty: (_, key) => (signals[key] && del(signals, key), 1)
  });
  return state;
}
function set(signals, key, v) {
  let s = signals[key];
  if (!s) {
    signals[key] = s = v?.peek ? v : signal(store(v));
  } else if (v === s.peek())
    ;
  else if (s._set)
    s._set(v);
  else if (Array.isArray(v) && Array.isArray(s.peek())) {
    const cur = s.peek();
    if (cur[_change])
      untracked(() => {
        batch(() => {
          let i = 0, l = v.length;
          for (; i < l; i++)
            cur[i] = v[i];
          cur.length = l;
        });
      });
    else {
      s.value = v;
    }
  } else {
    s.value = store(v);
  }
}
function del(signals, key) {
  const s = signals[key], del2 = s[Symbol.dispose];
  if (del2)
    delete s[Symbol.dispose];
  delete signals[key];
  del2?.();
}

// core.js
var _dispose = Symbol.dispose ||= Symbol("dispose");
var directive = {};
var memo = /* @__PURE__ */ new WeakMap();
function sprae(el, values) {
  if (!el?.children)
    return;
  if (memo.has(el)) {
    return Object.assign(memo.get(el), values);
  }
  const state = store(values || {}), disposes = [];
  init(el);
  if (!memo.has(el))
    memo.set(el, state);
  el[_dispose] = () => {
    while (disposes.length)
      disposes.pop()();
    memo.delete(el);
  };
  return state;
  function init(el2, parent = el2.parentNode) {
    if (el2.attributes) {
      for (let i = 0; i < el2.attributes.length; ) {
        let attr2 = el2.attributes[i];
        if (attr2.name[0] === ":") {
          el2.removeAttribute(attr2.name);
          let names = attr2.name.slice(1).split(":");
          for (let name of names) {
            let dir = directive[name] || directive.default;
            let evaluate = (dir.parse || parse)(attr2.value, parse);
            let dispose = dir(el2, evaluate, state, name);
            if (dispose)
              disposes.push(dispose);
          }
          if (memo.has(el2))
            return disposes.push(el2[_dispose]);
          if (el2.parentNode !== parent)
            return;
        } else
          i++;
      }
    }
    for (let child of [...el2.children])
      init(child, el2);
  }
  ;
}
var evalMemo = {};
var parse = (expr, dir, fn) => {
  if (fn = evalMemo[expr = expr.trim()])
    return fn;
  try {
    fn = compile(expr);
  } catch (e) {
    throw Object.assign(e, { message: `\u2234 ${e.message}

${dir}${expr ? `="${expr}"

` : ""}`, expr });
  }
  return evalMemo[expr] = fn;
};
var compile;
sprae.use = (s) => {
  s.signal && use(s);
  s.compile && (compile = s.compile);
};

// node_modules/ulive/dist/ulive.es.js
var ulive_es_exports = {};
__export(ulive_es_exports, {
  batch: () => batch2,
  computed: () => computed2,
  effect: () => effect2,
  signal: () => signal2,
  untracked: () => untracked2
});
var current;
var batched;
var signal2 = (v, s, obs = /* @__PURE__ */ new Set()) => (s = {
  get value() {
    current?.deps.push(obs.add(current));
    return v;
  },
  set value(val) {
    if (val === v)
      return;
    v = val;
    for (let sub of obs)
      batched ? batched.add(sub) : sub();
  },
  peek() {
    return v;
  }
}, s.toJSON = s.then = s.toString = s.valueOf = () => s.value, s);
var effect2 = (fn, teardown, fx, deps) => (fx = (prev) => {
  teardown?.call?.();
  prev = current, current = fx;
  try {
    teardown = fn();
  } finally {
    current = prev;
  }
}, deps = fx.deps = [], fx(), (dep) => {
  teardown?.call?.();
  while (dep = deps.pop())
    dep.delete(fx);
});
var computed2 = (fn, s = signal2(), c, e) => (c = {
  get value() {
    e ||= effect2(() => s.value = fn());
    return s.value;
  },
  peek: s.peek
}, c.toJSON = c.then = c.toString = c.valueOf = () => c.value, c);
var batch2 = (fn) => {
  let fxs = batched;
  if (!fxs)
    batched = /* @__PURE__ */ new Set();
  try {
    fn();
  } finally {
    if (!fxs) {
      fxs = batched;
      batched = null;
      for (const fx of fxs)
        fx();
    }
  }
};
var untracked2 = (fn, prev, v) => (prev = current, current = null, v = fn(), current = prev, v);

// directive/each.js
var _each = Symbol(":each");
directive.each = (tpl, [itemVar, idxVar, evaluate], state) => {
  const holder = tpl[_each] = document.createTextNode("");
  tpl.replaceWith(holder);
  let cur, keys2, prevl = 0;
  const items = computed(() => {
    keys2 = null;
    let items2 = evaluate(state);
    if (typeof items2 === "number")
      items2 = Array.from({ length: items2 }, (_, i) => i + 1);
    if (items2?.constructor === Object)
      keys2 = Object.keys(items2), items2 = Object.values(items2);
    return items2 || [];
  });
  const update = () => {
    untracked(() => {
      let i = 0, newItems = items.value, newl = newItems.length;
      if (cur && !cur[_change]) {
        for (let s of cur[_signals] || []) {
          s[Symbol.dispose]();
        }
        cur = null, prevl = 0;
      }
      if (newl < prevl) {
        cur.length = newl;
      } else {
        if (!cur) {
          cur = newItems;
        } else {
          for (; i < prevl; i++) {
            cur[i] = newItems[i];
          }
        }
        for (; i < newl; i++) {
          cur[i] = newItems[i];
          let idx = i, scope = Object.create(state, {
            [itemVar]: { get() {
              return cur[idx];
            } },
            [idxVar]: { value: keys2 ? keys2[idx] : idx }
          }), el = (tpl.content || tpl).cloneNode(true), frag = tpl.content ? { children: [...el.children], remove() {
            this.children.map((el2) => el2.remove());
          } } : el;
          holder.before(el);
          sprae(frag, scope);
          ((cur[_signals] ||= [])[i] ||= {})[Symbol.dispose] = () => {
            frag[Symbol.dispose](), frag.remove();
          };
        }
      }
      prevl = newl;
    });
  };
  let planned = 0;
  return effect(() => {
    items.value[_change]?.value;
    if (!planned) {
      update();
      queueMicrotask(() => (planned && update(), planned = 0));
    } else
      planned++;
  });
};
directive.each.parse = (expr, parse2) => {
  let [leftSide, itemsExpr] = expr.split(/\s+in\s+/);
  let [itemVar, idxVar = "$"] = leftSide.split(/\s*,\s*/);
  return [itemVar, idxVar, parse2(itemsExpr)];
};

// directive/if.js
var _prevIf = Symbol("if");
directive.if = (ifEl, evaluate, state) => {
  let parent = ifEl.parentNode, next = ifEl.nextElementSibling, holder = document.createTextNode(""), cur, ifs, elses, none = [];
  ifEl.after(holder);
  if (ifEl.content)
    cur = none, ifEl.remove(), ifs = [...ifEl.content.childNodes];
  else
    ifs = cur = [ifEl];
  if (next?.hasAttribute(":else")) {
    next.removeAttribute(":else");
    if (next.hasAttribute(":if"))
      elses = none;
    else
      next.remove(), elses = next.content ? [...next.content.childNodes] : [next];
  } else
    elses = none;
  return effect(() => {
    const newEls = evaluate(state) ? ifs : ifEl[_prevIf] ? none : elses;
    if (next)
      next[_prevIf] = newEls === ifs;
    if (cur != newEls) {
      if (cur[0]?.[_each])
        cur = [cur[0][_each]];
      for (let el of cur)
        el.remove();
      cur = newEls;
      for (let el of cur)
        parent.insertBefore(el, holder), sprae(el, state);
    }
  });
};

// directive/default.js
directive.default = (el, evaluate, state, name) => {
  let evt = name.startsWith("on") && name.slice(2), off;
  return effect(
    evt ? () => (off?.(), off = on(el, evt, evaluate(state))) : () => {
      let value = evaluate(state);
      if (name)
        attr(el, name, ipol(value, state));
      else
        for (let key in value)
          attr(el, dashcase(key), ipol(value[key], state));
    }
  );
};
var on = (el, e, fn = () => {
}) => {
  const ctx = { evt: "", target: el, test: () => true };
  ctx.evt = e.replace(
    /\.(\w+)?-?([-\w]+)?/g,
    (match, mod, param = "") => (ctx.test = mods[mod]?.(ctx, ...param.split("-")) || ctx.test, "")
  );
  const { evt, target, test, defer, stop, prevent, ...opts } = ctx;
  if (defer)
    fn = defer(fn);
  const cb = (e2) => test(e2) && (stop && e2.stopPropagation(), prevent && e2.preventDefault(), fn.call(target, e2));
  target.addEventListener(evt, cb, opts);
  return () => target.removeEventListener(evt, cb, opts);
};
var mods = {
  prevent(ctx) {
    ctx.prevent = true;
  },
  stop(ctx) {
    ctx.stop = true;
  },
  once(ctx) {
    ctx.once = true;
  },
  passive(ctx) {
    ctx.passive = true;
  },
  capture(ctx) {
    ctx.capture = true;
  },
  window(ctx) {
    ctx.target = window;
  },
  document(ctx) {
    ctx.target = document;
  },
  throttle(ctx, limit) {
    ctx.defer = (fn) => throttle(fn, limit ? Number(limit) || 0 : 108);
  },
  debounce(ctx, wait) {
    ctx.defer = (fn) => debounce(fn, wait ? Number(wait) || 0 : 108);
  },
  outside: (ctx) => (e) => {
    let target = ctx.target;
    if (target.contains(e.target))
      return false;
    if (e.target.isConnected === false)
      return false;
    if (target.offsetWidth < 1 && target.offsetHeight < 1)
      return false;
    return true;
  },
  self: (ctx) => (e) => e.target === ctx.target,
  ctrl: (_, ...param) => (e) => keys.ctrl(e) && param.every((p) => keys[p] ? keys[p](e) : e.key === p),
  shift: (_, ...param) => (e) => keys.shift(e) && param.every((p) => keys[p] ? keys[p](e) : e.key === p),
  alt: (_, ...param) => (e) => keys.alt(e) && param.every((p) => keys[p] ? keys[p](e) : e.key === p),
  meta: (_, ...param) => (e) => keys.meta(e) && param.every((p) => keys[p] ? keys[p](e) : e.key === p),
  arrow: () => keys.arrow,
  enter: () => keys.enter,
  escape: () => keys.escape,
  tab: () => keys.tab,
  space: () => keys.space,
  backspace: () => keys.backspace,
  delete: () => keys.delete,
  digit: () => keys.digit,
  letter: () => keys.letter,
  character: () => keys.character
};
var keys = {
  ctrl: (e) => e.ctrlKey || e.key === "Control" || e.key === "Ctrl",
  shift: (e) => e.shiftKey || e.key === "Shift",
  alt: (e) => e.altKey || e.key === "Alt",
  meta: (e) => e.metaKey || e.key === "Meta" || e.key === "Command",
  arrow: (e) => e.key.startsWith("Arrow"),
  enter: (e) => e.key === "Enter",
  escape: (e) => e.key.startsWith("Esc"),
  tab: (e) => e.key === "Tab",
  space: (e) => e.key === "\xA0" || e.key === "Space" || e.key === " ",
  backspace: (e) => e.key === "Backspace",
  delete: (e) => e.key === "Delete",
  digit: (e) => /^\d$/.test(e.key),
  letter: (e) => /^[a-zA-Z]$/.test(e.key),
  character: (e) => /^\S$/.test(e.key)
};
var attr = (el, name, v) => {
  if (v == null || v === false)
    el.removeAttribute(name);
  else
    el.setAttribute(name, v === true ? "" : typeof v === "number" || typeof v === "string" ? v : "");
};
var throttle = (fn, limit) => {
  let pause, planned, block = (e) => {
    pause = true;
    setTimeout(() => {
      pause = false;
      if (planned)
        return planned = false, block(e), fn(e);
    }, limit);
  };
  return (e) => {
    if (pause)
      return planned = true;
    block(e);
    return fn(e);
  };
};
var debounce = (fn, wait) => {
  let timeout;
  return (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn(e);
    }, wait);
  };
};
var dashcase = (str) => {
  return str.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, (match) => "-" + match.toLowerCase());
};
var ipol = (v, state) => {
  return v?.replace ? v.replace(/\$<([^>]+)>/g, (match, field) => state[field] ?? "") : v;
};

// directive/ref.js
directive.ref = (el, expr, state) => {
  Object.defineProperty(state, ipol(expr, state), { value: el });
};
directive.ref.parse = (expr) => expr;

// directive/with.js
directive.with = (el, evaluate, rootState) => {
  let state;
  return effect(() => {
    let values = evaluate(rootState);
    if (!state) {
      state = store({});
      Object.assign(state[_signals], rootState[_signals]);
      for (let key in values)
        state[_signals][key] = null, state[key] = values[key];
      sprae(el, state);
    } else {
      Object.assign(state, values);
    }
  });
};

// directive/html.js
directive.html = (el, evaluate, state) => {
  let tpl = evaluate(state);
  if (!tpl)
    return;
  let content = (tpl.content || tpl).cloneNode(true);
  el.replaceChildren(content);
  sprae(el, state);
};

// directive/text.js
directive.text = (el, evaluate, state) => {
  if (el.content)
    el.replaceWith(el = document.createTextNode(""));
  return effect(() => {
    let value = evaluate(state);
    el.textContent = value == null ? "" : value;
  });
};

// directive/class.js
directive.class = (el, evaluate, state) => {
  let cur = /* @__PURE__ */ new Set();
  return effect(() => {
    let v = evaluate(state);
    let clsx = /* @__PURE__ */ new Set();
    if (v) {
      if (typeof v === "string")
        ipol(v, state).split(" ").map((cls) => clsx.add(cls));
      else if (Array.isArray(v))
        v.map((v2) => (v2 = ipol(v2, state)) && clsx.add(v2));
      else
        Object.entries(v).map(([k, v2]) => v2 && clsx.add(k));
    }
    for (let cls of cur)
      if (clsx.has(cls))
        clsx.delete(cls);
      else
        el.classList.remove(cls);
    for (let cls of cur = clsx)
      el.classList.add(cls);
  });
};

// directive/style.js
directive.style = (el, evaluate, state) => {
  let initStyle = el.getAttribute("style") || "";
  if (!initStyle.endsWith(";"))
    initStyle += "; ";
  return effect(() => {
    let v = evaluate(state);
    if (typeof v === "string")
      el.setAttribute("style", initStyle + ipol(v, state));
    else {
      el.setAttribute("style", initStyle);
      for (let k in v)
        el.style.setProperty(k, ipol(v[k], state));
    }
  });
};

// directive/value.js
directive.value = (el, evaluate, state) => {
  let from, to;
  let update = el.type === "text" || el.type === "" ? (value) => el.setAttribute("value", el.value = value == null ? "" : value) : el.tagName === "TEXTAREA" || el.type === "text" || el.type === "" ? (value) => (from = el.selectionStart, to = el.selectionEnd, el.setAttribute("value", el.value = value == null ? "" : value), from && el.setSelectionRange(from, to)) : el.type === "checkbox" ? (value) => (el.checked = value, attr(el, "checked", value)) : el.type === "select-one" ? (value) => {
    for (let option in el.options)
      option.removeAttribute("selected");
    el.value = value;
    el.selectedOptions[0]?.setAttribute("selected", "");
  } : (value) => el.value = value;
  return effect(() => update(evaluate(state)));
};

// directive/fx.js
directive.fx = (el, evaluate, state) => {
  return effect(() => evaluate(state));
};

// sprae.js
sprae.use(ulive_es_exports);
sprae.use({ compile: (expr) => sprae.constructor(`__scope`, `with (__scope) { return ${expr} };`) });
var sprae_default = sprae;
export {
  sprae_default as default
};

// ../../../../miso/ts/miso/util.ts
function getDOMRef(tree) {
  switch (tree.type) {
    case 0 /* VComp */:
      return drill(tree);
    default:
      return tree.domRef;
  }
}
function drill(c) {
  if (!c.child)
    throw new Error("'drill' called on an unmounted Component. This should never happen, please make an issue.");
  switch (c.child.type) {
    case 0 /* VComp */:
      return drill(c.child);
    default:
      return c.child.domRef;
  }
}

// ../../../../miso/ts/miso/dom.ts
function diff(c, n, parent, context) {
  if (!c && !n)
    return;
  else if (!c)
    create(n, parent, context);
  else if (!n)
    destroy(c, parent, context);
  else if (c.type === 2 /* VText */ && n.type === 2 /* VText */) {
    diffVText(c, n, context);
  } else if (c.type === 0 /* VComp */ && n.type === 0 /* VComp */) {
    if (n.key === c.key) {
      n.child = c.child;
      n.componentId = c.componentId;
      if (c.child)
        c.child.parent = n;
      return;
    }
    replace(c, n, parent, context);
  } else if (c.type === 1 /* VNode */ && n.type === 1 /* VNode */) {
    if (n.tag === c.tag && n.key === c.key) {
      n.domRef = c.domRef;
      diffAttrs(c, n, context);
    } else {
      replace(c, n, parent, context);
    }
  } else
    replace(c, n, parent, context);
}
function diffVText(c, n, context) {
  if (c.text !== n.text)
    context.setTextContent(c.domRef, n.text);
  n.domRef = c.domRef;
  return;
}
function replace(c, n, parent, context) {
  switch (c.type) {
    case 2 /* VText */:
      break;
    default:
      callBeforeDestroyedRecursive(c);
      break;
  }
  createElement(parent, 1 /* REPLACE */, getDOMRef(c), n, context);
  switch (c.type) {
    case 2 /* VText */:
      break;
    default:
      callDestroyedRecursive(c);
      break;
  }
}
function destroy(c, parent, context) {
  switch (c.type) {
    case 2 /* VText */:
      break;
    default:
      callBeforeDestroyedRecursive(c);
      break;
  }
  context.removeChild(parent, getDOMRef(c));
  switch (c.type) {
    case 2 /* VText */:
      break;
    default:
      callDestroyedRecursive(c);
      break;
  }
}
function callDestroyedRecursive(c) {
  callDestroyed(c);
  switch (c.type) {
    case 1 /* VNode */:
      for (const child of c.children) {
        if (child.type === 1 /* VNode */ || child.type === 0 /* VComp */) {
          callDestroyedRecursive(child);
        }
      }
      break;
    case 0 /* VComp */:
      if (c.child) {
        if (c.child.type === 1 /* VNode */ || c.child.type === 0 /* VComp */)
          callDestroyedRecursive(c.child);
      }
      break;
  }
}
function callDestroyed(c) {
  if (c.type === 1 /* VNode */ && c.onDestroyed)
    c.onDestroyed();
  if (c.type === 0 /* VComp */)
    unmountComponent(c);
}
function callBeforeDestroyed(c) {
  switch (c.type) {
    case 0 /* VComp */:
      break;
    case 1 /* VNode */:
      if (c.onBeforeDestroyed)
        c.onBeforeDestroyed();
      break;
    default:
      break;
  }
}
function callBeforeDestroyedRecursive(c) {
  callBeforeDestroyed(c);
  switch (c.type) {
    case 1 /* VNode */:
      for (const child of c.children) {
        if (child.type === 2 /* VText */)
          continue;
        callBeforeDestroyedRecursive(child);
      }
      break;
    case 0 /* VComp */:
      if (c.child) {
        if (c.child.type === 1 /* VNode */ || c.child.type === 0 /* VComp */)
          callBeforeDestroyedRecursive(c.child);
      }
      break;
  }
}
function diffAttrs(c, n, context) {
  diffProps(c ? c.props : {}, n.props, n.domRef, n.ns === "svg", context);
  diffClass(c ? c.classList : null, n.classList, n.domRef, context);
  diffCss(c ? c.css : {}, n.css, n.domRef, context);
  diffChildren(c ? c.children : [], n.children, n.domRef, context);
  drawCanvas(n);
}
function diffClass(c, n, domRef, context) {
  if (!c && !n) {
    return;
  }
  if (!c) {
    for (const className of n) {
      context.addClass(className, domRef);
    }
    return;
  }
  if (!n) {
    for (const className of c) {
      context.removeClass(className, domRef);
    }
    return;
  }
  for (const className of c) {
    if (!n.has(className)) {
      context.removeClass(className, domRef);
    }
  }
  for (const className of n) {
    if (!c.has(className)) {
      context.addClass(className, domRef);
    }
  }
  return;
}
function diffProps(cProps, nProps, node, isSvg, context) {
  var newProp;
  for (const c in cProps) {
    newProp = nProps[c];
    if (newProp === undefined) {
      if (isSvg || !(c in node) || c === "disabled") {
        context.removeAttribute(node, c);
      } else {
        context.setAttribute(node, c, "");
      }
    } else {
      if (newProp === cProps[c] && c !== "checked" && c !== "value")
        continue;
      if (isSvg) {
        if (c === "href") {
          context.setAttributeNS(node, "http://www.w3.org/1999/xlink", "href", newProp);
        } else {
          context.setAttribute(node, c, newProp);
        }
      } else if (c in node && !(c === "list" || c === "form")) {
        node[c] = newProp;
      } else {
        context.setAttribute(node, c, newProp);
      }
    }
  }
  for (const n in nProps) {
    if (cProps && cProps[n])
      continue;
    newProp = nProps[n];
    if (isSvg) {
      if (n === "href") {
        context.setAttributeNS(node, "http://www.w3.org/1999/xlink", "href", newProp);
      } else {
        context.setAttribute(node, n, newProp);
      }
    } else if (n in node && !(n === "list" || n === "form")) {
      node[n] = nProps[n];
    } else {
      context.setAttribute(node, n, newProp);
    }
  }
}
function diffCss(cCss, nCss, node, context) {
  context.setInlineStyle(cCss, nCss, node);
}
function shouldSync(cs, ns) {
  if (cs.length === 0 || ns.length === 0)
    return false;
  for (var i = 0;i < cs.length; i++) {
    if (cs[i].key === null || cs[i].key === undefined) {
      return false;
    }
  }
  for (var i = 0;i < ns.length; i++) {
    if (ns[i].key === null || ns[i].key === undefined) {
      return false;
    }
  }
  return true;
}
function diffChildren(cs, ns, parent, context) {
  if (shouldSync(cs, ns)) {
    syncChildren(cs, ns, parent, context);
  } else {
    for (let i = 0;i < Math.max(ns.length, cs.length); i++)
      diff(cs[i], ns[i], parent, context);
  }
}
function populateDomRef(c, context) {
  if (c.ns === "svg") {
    c.domRef = context.createElementNS("http://www.w3.org/2000/svg", c.tag);
  } else if (c.ns === "mathml") {
    c.domRef = context.createElementNS("http://www.w3.org/1998/Math/MathML", c.tag);
  } else {
    c.domRef = context.createElement(c.tag);
  }
}
function createElement(parent, op, replacing, n, context) {
  switch (n.type) {
    case 2 /* VText */:
      n.domRef = context.createTextNode(n.text);
      switch (op) {
        case 2 /* INSERT_BEFORE */:
          context.insertBefore(parent, n.domRef, replacing);
          break;
        case 0 /* APPEND */:
          context.appendChild(parent, n.domRef);
          break;
        case 1 /* REPLACE */:
          context.replaceChild(parent, n.domRef, replacing);
          break;
      }
      break;
    case 0 /* VComp */:
      mountComponent(parent, op, replacing, n, context);
      break;
    case 1 /* VNode */:
      if (n.onBeforeCreated)
        n.onBeforeCreated();
      populateDomRef(n, context);
      if (n.onCreated)
        n.onCreated(n.domRef);
      diffAttrs(null, n, context);
      switch (op) {
        case 2 /* INSERT_BEFORE */:
          context.insertBefore(parent, n.domRef, replacing);
          break;
        case 0 /* APPEND */:
          context.appendChild(parent, n.domRef);
          break;
        case 1 /* REPLACE */:
          context.replaceChild(parent, n.domRef, replacing);
          break;
      }
      break;
  }
}
function drawCanvas(c) {
  if (c.tag === "canvas" && c.draw)
    c.draw(c.domRef);
}
function unmountComponent(c) {
  c.unmount(c.componentId);
}
function mountComponent(parent, op, replacing, n, context) {
  let mounted = n.mount(parent);
  n.componentId = mounted.componentId;
  n.child = mounted.componentTree;
  mounted.componentTree.parent = n;
  if (mounted.componentTree.type !== 0 /* VComp */) {
    const childDomRef = getDOMRef(mounted.componentTree);
    if (op === 1 /* REPLACE */ && replacing) {
      context.replaceChild(parent, childDomRef, replacing);
    } else if (op === 2 /* INSERT_BEFORE */) {
      context.insertBefore(parent, childDomRef, replacing);
    }
  }
}
function create(n, parent, context) {
  createElement(parent, 0 /* APPEND */, null, n, context);
}
function insertBefore(parent, n, o, context) {
  context.insertBefore(parent, getDOMRef(n), o ? getDOMRef(o) : null);
}
function swapDOMRef(oLast, oFirst, parent, context) {
  context.swapDOMRefs(getDOMRef(oLast), getDOMRef(oFirst), parent);
}
function syncChildren(os, ns, parent, context) {
  var oldFirstIndex = 0, newFirstIndex = 0, oldLastIndex = os.length - 1, newLastIndex = ns.length - 1, tmp, nFirst, nLast, oLast, oFirst, found, node;
  for (;; ) {
    if (newFirstIndex > newLastIndex && oldFirstIndex > oldLastIndex) {
      break;
    }
    nFirst = ns[newFirstIndex];
    nLast = ns[newLastIndex];
    oFirst = os[oldFirstIndex];
    oLast = os[oldLastIndex];
    if (oldFirstIndex > oldLastIndex) {
      diff(null, nFirst, parent, context);
      insertBefore(parent, nFirst, oFirst, context);
      os.splice(newFirstIndex, 0, nFirst);
      newFirstIndex++;
    } else if (newFirstIndex > newLastIndex) {
      tmp = oldLastIndex;
      while (oldLastIndex >= oldFirstIndex) {
        destroy(os[oldLastIndex--], parent, context);
      }
      os.splice(oldFirstIndex, tmp - oldFirstIndex + 1);
      break;
    } else if (oFirst.key === nFirst.key) {
      diff(os[oldFirstIndex++], ns[newFirstIndex++], parent, context);
    } else if (oLast.key === nLast.key) {
      diff(os[oldLastIndex--], ns[newLastIndex--], parent, context);
    } else if (oFirst.key === nLast.key && nFirst.key === oLast.key) {
      swapDOMRef(oLast, oFirst, parent, context);
      swap(os, oldFirstIndex, oldLastIndex);
      diff(os[oldFirstIndex++], ns[newFirstIndex++], parent, context);
      diff(os[oldLastIndex--], ns[newLastIndex--], parent, context);
    } else if (oFirst.key === nLast.key) {
      insertBefore(parent, oFirst, oLast.nextSibling, context);
      os.splice(oldLastIndex, 0, os.splice(oldFirstIndex, 1)[0]);
      diff(os[oldLastIndex--], ns[newLastIndex--], parent, context);
    } else if (oLast.key === nFirst.key) {
      insertBefore(parent, oLast, oFirst, context);
      os.splice(oldFirstIndex, 0, os.splice(oldLastIndex, 1)[0]);
      diff(os[oldFirstIndex++], nFirst, parent, context);
      newFirstIndex++;
    } else {
      found = false;
      tmp = oldFirstIndex;
      while (tmp <= oldLastIndex) {
        if (os[tmp].key === nFirst.key) {
          found = true;
          node = os[tmp];
          break;
        }
        tmp++;
      }
      if (found) {
        os.splice(oldFirstIndex, 0, os.splice(tmp, 1)[0]);
        diff(os[oldFirstIndex++], nFirst, parent, context);
        insertBefore(parent, node, os[oldFirstIndex], context);
        newFirstIndex++;
      } else {
        createElement(parent, 2 /* INSERT_BEFORE */, getDOMRef(oFirst), nFirst, context);
        os.splice(oldFirstIndex++, 0, nFirst);
        newFirstIndex++;
        oldLastIndex++;
      }
    }
  }
}
function swap(os, l, r) {
  const k = os[l];
  os[l] = os[r];
  os[r] = k;
}

// ../../../../miso/ts/miso/event.ts
function delegator(mount, events, getVTree, debug, context) {
  for (const event of events) {
    context.addEventListener(mount, event.name, function(e) {
      listener(e, mount, getVTree, debug, context);
    }, event.capture);
  }
}
function listener(e, mount, getVTree, debug, context) {
  getVTree(function(vtree) {
    if (Array.isArray(e)) {
      for (const key of e) {
        dispatch(key, vtree, mount, debug, context);
      }
    } else {
      dispatch(e, vtree, mount, debug, context);
    }
  });
}
function dispatch(ev, vtree, mount, debug, context) {
  var target = context.getTarget(ev);
  if (target) {
    let stack = buildTargetToElement(mount, target, context);
    delegateEvent(ev, vtree, stack, debug, context);
  }
}
function buildTargetToElement(element, target, context) {
  var stack = [];
  while (!context.isEqual(element, target)) {
    stack.unshift(target);
    if (target && context.parentNode(target)) {
      target = context.parentNode(target);
    } else {
      return stack;
    }
  }
  return stack;
}
function delegateEvent(event, obj, stack, debug, context) {
  if (!stack.length) {
    if (debug) {
      console.warn('Event "' + event.type + '" did not find an event handler to dispatch on', obj, event);
    }
    return;
  } else if (stack.length > 1) {
    if (obj.type === 2 /* VText */) {
      return;
    } else if (obj.type === 0 /* VComp */) {
      if (!obj.child) {
        if (debug) {
          console.error("VComp has no child property set during event delegation", obj);
          console.error("This means the Component has not been fully mounted, this should never happen");
          throw new Error("VComp has no .child property set during event delegation");
        }
        return;
      }
      return delegateEvent(event, obj.child, stack, debug, context);
    } else if (obj.type === 1 /* VNode */) {
      if (context.isEqual(obj.domRef, stack[0])) {
        const eventObj = obj.events.captures[event.type];
        if (eventObj) {
          const options = eventObj.options;
          if (options.preventDefault)
            event.preventDefault();
          if (!event["captureStopped"]) {
            eventObj.runEvent(event, obj.domRef);
          }
          if (options.stopPropagation) {
            event["captureStopped"] = true;
          }
        }
        stack.splice(0, 1);
        for (const child of obj.children) {
          if (context.isEqual(getDOMRef(child), stack[0])) {
            delegateEvent(event, child, stack, debug, context);
          }
        }
      }
      return;
    }
  } else {
    if (obj.type === 0 /* VComp */) {
      if (obj.child) {
        delegateEvent(event, obj.child, stack, debug, context);
      }
    } else if (obj.type === 1 /* VNode */) {
      const eventCaptureObj = obj.events.captures[event.type];
      if (eventCaptureObj && !event["captureStopped"]) {
        const options = eventCaptureObj.options;
        if (context.isEqual(stack[0], obj.domRef)) {
          if (options.preventDefault)
            event.preventDefault();
          eventCaptureObj.runEvent(event, stack[0]);
          if (options.stopPropagation)
            event["captureStopped"] = true;
        }
      }
      const eventObj = obj.events.bubbles[event.type];
      if (eventObj && !event["captureStopped"]) {
        const options = eventObj.options;
        if (context.isEqual(stack[0], obj.domRef)) {
          if (options.preventDefault)
            event.preventDefault();
          eventObj.runEvent(event, stack[0]);
          if (!options.stopPropagation) {
            propagateWhileAble(obj.parent, event);
          }
        }
      } else {
        if (!event["captureStopped"]) {
          propagateWhileAble(obj.parent, event);
        }
      }
    }
  }
}
function propagateWhileAble(vtree, event) {
  while (vtree) {
    switch (vtree.type) {
      case 2 /* VText */:
        break;
      case 1 /* VNode */:
        const eventObj = vtree.events.bubbles[event.type];
        if (eventObj) {
          const options = eventObj.options;
          if (options.preventDefault)
            event.preventDefault();
          eventObj.runEvent(event, vtree.domRef);
          if (options.stopPropagation) {
            return;
          }
        }
        vtree = vtree.parent;
        break;
      case 0 /* VComp */:
        if (!vtree.eventPropagation)
          return;
        vtree = vtree.parent;
        break;
    }
  }
}

// ../../../../miso/ts/miso/context/dom.ts
var eventContext = {
  addEventListener: (mount, event, listener2, capture) => {
    mount.addEventListener(event, listener2, capture);
  },
  delegator: (mount, events, getVTree, debug, ctx) => {
    delegator(mount, events, getVTree, debug, ctx);
  },
  isEqual: (x, y) => {
    return x === y;
  },
  getTarget: (e) => {
    return e.target;
  },
  parentNode: (node) => {
    return node.parentNode;
  }
};
var drawingContext = {
  nextSibling: (node) => {
    if (node.nextSibling) {
      switch (node.nextSibling.type) {
        case 0 /* VComp */:
          return drill(node.nextSibling);
        default:
          return node.nextSibling.domRef;
      }
    }
    return null;
  },
  createTextNode: (s) => {
    return document.createTextNode(s);
  },
  createElementNS: (ns, tag) => {
    return document.createElementNS(ns, tag);
  },
  appendChild: (parent, child) => {
    return parent.appendChild(child);
  },
  replaceChild: (parent, n, old) => {
    return parent.replaceChild(n, old);
  },
  removeChild: (parent, child) => {
    return parent.removeChild(child);
  },
  createElement: (tag) => {
    return document.createElement(tag);
  },
  addClass: (className, domRef) => {
    if (className)
      domRef.classList.add(className);
  },
  removeClass: (className, domRef) => {
    if (className)
      domRef.classList.remove(className);
  },
  insertBefore: (parent, child, node) => {
    return parent.insertBefore(child, node);
  },
  swapDOMRefs: (oLast, oFirst, p) => {
    const tmp = oLast.nextSibling;
    p.insertBefore(oLast, oFirst);
    p.insertBefore(oFirst, tmp);
    return;
  },
  setInlineStyle: (cCss, nCss, node) => {
    var result;
    for (const key in cCss) {
      result = nCss[key];
      if (!result) {
        if (key in node.style) {
          node.style[key] = "";
        } else {
          node.style.setProperty(key, "");
        }
      } else if (result !== cCss[key]) {
        if (key in node.style) {
          node.style[key] = result;
        } else {
          node.style.setProperty(key, result);
        }
      }
    }
    for (const n in nCss) {
      if (cCss && cCss[n])
        continue;
      if (n in node.style) {
        node.style[n] = nCss[n];
      } else {
        node.style.setProperty(n, nCss[n]);
      }
    }
    return;
  },
  setAttribute: (node, key, value) => {
    return node.setAttribute(key, value);
  },
  setAttributeNS: (node, ns, key, value) => {
    return node.setAttributeNS(ns, key, value);
  },
  removeAttribute: (node, key) => {
    return node.removeAttribute(key);
  },
  setTextContent: (node, text) => {
    node.textContent = text;
    return;
  },
  flush: () => {
    return;
  },
  getHead: function() {
    return document.head;
  },
  getRoot: function() {
    return document.body;
  }
};

// ../../../../miso/ts/miso/smart.ts
function vtext(input) {
  return {
    ns: "text",
    text: input,
    type: 2 /* VText */,
    domRef: null,
    key: null,
    parent: null,
    nextSibling: null
  };
}
function vnode(props) {
  var node = union(mkVNode(), props);
  return node;
}
function union(obj, updates) {
  return Object.assign({}, obj, updates);
}
function mkVNode() {
  return {
    props: {},
    css: {},
    classList: null,
    children: [],
    ns: "html",
    domRef: null,
    tag: "div",
    key: null,
    events: { captures: {}, bubbles: {} },
    onDestroyed: () => {},
    onBeforeDestroyed: () => {},
    onCreated: () => {},
    onBeforeCreated: () => {},
    type: 1 /* VNode */,
    nextSibling: null,
    parent: null
  };
}

// main.ts
function union2(obj, updates) {
  return Object.assign({}, obj, updates);
}
var delegatedEvents = [
  { name: "click", capture: true }
];
var m = (tag, obj) => {
  return vnode(union2({ tag }, obj));
};
var currentVTree = null;
var initDelegator = () => {
  delegator(document.body, delegatedEvents, (f) => f(currentVTree), false, eventContext);
};
var render = () => {
  var newTree = view();
  diff(currentVTree, newTree, document.body, drawingContext);
  currentVTree = newTree;
};
var eventAction = function(f) {
  return {
    options: { preventDefault: false, stopPropagation: false },
    runEvent: function(e) {
      f(e);
      render();
    }
  };
};
var eventActionStop = function(f) {
  return {
    options: { preventDefault: false, stopPropagation: true },
    runEvent: function(e) {
      f(e);
      render();
    }
  };
};
var viewJumbotron = function() {
  return m("div", {
    classList: new Set(["jumbotron"]),
    children: [
      m("div", {
        classList: new Set(["row"]),
        children: [
          m("div", {
            classList: new Set(["col-md-6"]),
            children: [m("h1", { children: [vtext("miso.js-1.9.0.0-keyed")] })]
          }),
          m("div", {
            classList: new Set(["col-md-6"]),
            children: [
              m("div", {
                classList: new Set(["row"]),
                children: [
                  btn("Create 1,000 rows", "run"),
                  btn("Create 10,000 rows", "runlots"),
                  btn("Append 1,000 rows", "add"),
                  btn("Update every 10th row", "update"),
                  btn("Clear", "clear"),
                  btn("Swap Rows", "swaprows")
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};
var createData = (count = 1000) => {
  var adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy"
  ];
  var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
  var nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard"
  ];
  var data = [];
  for (var i = 0;i < count; i++)
    data.push({
      id: model.lastId++,
      label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
    });
  return data;
};
var _random = (max) => Math.round(Math.random() * 1000) % max;
var dispatch2 = function(op, id) {
  return function() {
    if (op === "swaprows") {
      if (model.data.length > 998) {
        var a = model.data[1];
        model.data[1] = model.data[998];
        model.data[998] = a;
      }
    }
    if (op === "run") {
      model.data = createData();
      model.selected = null;
    }
    if (op === "clear") {
      model.data = [];
      model.selected = null;
    }
    if (op === "select") {
      model.selected = id;
    }
    if (op === "runlots") {
      model.data = createData(1e4);
      model.selected = null;
    }
    if (op === "add") {
      model.data = model.data.concat(createData(1000));
      model.selected = null;
    }
    if (op === "delete") {
      const idx = model.data.findIndex((d) => d.id == id);
      model.data = model.data.filter((e, i) => i != idx);
    }
    if (op === "update") {
      for (let i = 0;i < model.data.length; i += 10)
        model.data[i].label += " !!!";
    }
  };
};
var btn = (msg, op) => m("div", {
  classList: new Set(["col-sm-6", "smallpad"]),
  children: [
    m("button", {
      classList: new Set(["btn", "btn-primary", "btn-block"]),
      props: {
        type: "button",
        id: op
      },
      events: { captures: { click: eventAction(dispatch2(op, op)) }, bubbles: {} },
      children: [vtext(msg)]
    })
  ]
});
var viewTable = () => {
  return m("table", {
    classList: new Set(["table", "table-hover", "table-striped", "test-data"]),
    children: [m("tbody", { props: { id: "tbody" }, children: model.data.map(makeRow) })]
  });
};
var makeRow = (x) => {
  return m("tr", {
    key: x.id,
    events: { captures: { click: eventAction(dispatch2("select", x.id)) }, bubbles: {} },
    classList: new Set([x.id === model.selected ? "danger" : ""]),
    children: [
      m("td", {
        classList: new Set(["col-md-1"]),
        children: [vtext(x.id)]
      }),
      m("td", {
        classList: new Set(["col-md-4"]),
        children: [
          m("a", {
            classList: new Set(["lbl"]),
            children: [vtext(x.label)]
          })
        ]
      }),
      m("td", {
        classList: new Set(["col-md-1"]),
        children: [
          m("a", {
            classList: new Set(["remove"]),
            children: [
              m("span", {
                props: { "aria-hidden": true },
                events: { captures: { click: eventActionStop(dispatch2("delete", x.id)) }, bubbles: {} },
                classList: new Set(["remove", "glyphicon", "glyphicon-remove"])
              })
            ]
          })
        ]
      }),
      m("td", {
        classList: new Set(["col-md-6"])
      })
    ]
  });
};
var view = () => m("div", {
  classList: new Set(["container"]),
  children: [viewJumbotron(), viewTable()]
});
var model = null;
function init(config) {
  model = config;
  model.lastId = 1;
  model.data = [];
  render();
  initDelegator();
}
globalThis.startApp = (config) => {
  init(config);
};

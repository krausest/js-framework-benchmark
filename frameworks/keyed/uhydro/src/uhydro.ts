const $value = Symbol("value");
const $name = Symbol("name");
const reactiveMap = new WeakMap<LooseObject, ChildNode[]>();
const nodeChangeMap = new WeakMap<ChildNode, [string | symbol, string]>();
const observerMap = new Map<LooseObject, Function[]>();
const registerStack: Array<registerStackItem> = [];
const globalObj = reactive({});

function h(
  tag: string | Function | LooseObject,
  attrs?: LooseObject,
  ...children: Array<string | h>
): HTMLElement | DocumentFragment {
  if (typeof tag === Placeholder.function)
    return (tag as Function)({ ...attrs, children });
  else if (isObject(tag)) {
    return h("", void 0, (tag as LooseObject).children);
  }

  const element =
    tag === ""
      ? document.createDocumentFragment()
      : document.createElement(tag);
  for (const [key, value] of Object.entries(attrs ?? {})) {
    if (key in element) {
      //@ts-expect-error
      element[key] = value;
    } else {
      (element as HTMLElement).setAttribute(key, String(value));
    }
  }
  element.append(...children.flat(Infinity));

  // Register possible Update
  const [proxy, prop, value] = registerStack.pop() || [];
  if (proxy) {
    const childrenAsString = children.flatMap(idString);
    try {
      if (
        childrenAsString.includes(value) ||
        (!childrenAsString.includes(value) && isDocumentFragment(element)
          ? element.textContent!.includes(value)
          : (element as HTMLElement).outerHTML.includes(value))
      ) {
        const elem = isDocumentFragment(element)
          ? element.firstChild!
          : (element as ChildNode);
        if (reactiveMap.has(proxy)) {
          // This should be enough – no need to modify reactiveMapReverse?
          reactiveMap.get(proxy)!.push(elem);
        } else {
          const elemArr = [elem];
          reactiveMap.set(proxy, elemArr);
        }
        nodeChangeMap.set(elem, [prop!, value]);
      }
    } catch {
      return element;
    }
  }

  return element;
}

function render(elem: Element, where?: Element) {
  if (where) {
    where.replaceWith(elem);
  } else {
    document.body.insertBefore(elem, null);
  }
}

let internSet = false;
function reactive<T>(val: T): T & setterType {
  Reflect.set(setter, $value, val);
  let proxy = new Proxy(setter, {
    set(target, key, val, receiver) {
      const oldVal = Reflect.get(target, key, receiver);
      if (oldVal === val) return true;

      const isSet = Reflect.set(target, key, val, receiver);
      if (oldVal != null && isSet && !internSet) {
        schedule(updateDOM, val, receiver);
      }
      if (observerMap.has(receiver)) {
        observerMap
          .get(receiver)!
          .forEach(informObservers.bind(informObservers, val, oldVal));
      }
      return isSet;
    },
    get(target, prop, receiver) {
      const base = Reflect.get(target, $value);
      const isBaseObject = isObject(base);

      let value;
      if (isBaseObject) {
        value = Reflect.get(base, prop, receiver) || base;
      }

      const binding = [
        receiver,
        prop,
        isBaseObject ? value : base,
      ] as registerStackItem;
      registerStack.push(binding);
      queueMicrotask(deleteFromStack.bind(deleteFromStack, binding));
      return isBaseObject ? value : identity.bind(identity, base);
    },
  });

  // Register on global obj
  const proxyName = randomText();
  Reflect.set(proxy, $name, proxyName);
  if (globalObj && !Reflect.has(globalObj, proxyName)) {
    internSet = true;
    Reflect.set(globalObj, proxyName, proxy);
    internSet = false;
  }

  return proxy as unknown as T & typeof setter;

  function setter(newVal: (curr: T) => void | any) {
    if (proxy === null) return;

    if (newVal === null) {
      Reflect.deleteProperty(proxy, $value);

      //Garbage Collection
      let nodes: ChildNode[] | undefined;
      if (observerMap.has(proxy)) observerMap.delete(proxy);
      if (reactiveMap.has(proxy)) {
        nodes = reactiveMap.get(proxy)!;
        reactiveMap.delete(proxy);
      }
      for (let i = 0; nodes && i < nodes.length; i++) {
        const node = nodes[i];
        if (nodeChangeMap.has(node)) nodeChangeMap.delete(node);
      }

      proxy = newVal;
      return;
    } else if (typeof newVal === Placeholder.function) {
      setter(newVal(Reflect.get(proxy, $value)));
      return;
    }

    Reflect.set(proxy, $value, newVal);
  }
}

function observe(proxy: LooseObject, fn: Function) {
  if (observerMap.has(proxy)) {
    observerMap.get(proxy)!.push(fn);
  } else {
    observerMap.set(proxy, [fn]);
  }
}
function informObservers(newVal: any, oldVal: any, fn: Function) {
  fn(newVal, oldVal);
}

function view(root: string, data: LooseObject, renderFunction: renderFunction) {
  const rootElem = document.body.querySelector(root)!;
  const elements = Reflect.get(data, $value).map(renderFunction);
  rootElem.append(...elements);

  observe(data, renderView.bind(renderView, rootElem, renderFunction));
}
function renderView(
  rootElem: Element,
  renderFunction: renderFunction,
  newData: Array<LooseObject>,
  oldData: Array<LooseObject>
) {
  // Clear
  const sameSize =
    new Set([...oldData, ...newData]).size ===
    oldData?.length + newData?.length;

  if (!newData?.length || oldData?.length === newData?.length || sameSize) {
    rootElem.textContent = "";
    for (let index = 0; index < oldData.length; index++) {
      (oldData[index] as setterType)(null);
    }
  }

  // Add to existing
  if (oldData?.length && newData?.length > oldData?.length) {
    const length = oldData.length;
    const slicedData = sameSize ? newData : newData.slice(length);
    const newElements = slicedData.map(
      newElementsFn.bind(newElementsFn, renderFunction, length)
    );
    rootElem.append(...newElements);
  }

  // Remove and add
  else if (newData?.length && newData?.length < oldData.length) {
    oldData
      .reverse()
      .forEach(
        removeChild.bind(removeChild, rootElem, newData, oldData.length - 1)
      );
    newData.forEach(
      addNewOnes.bind(addNewOnes, rootElem, renderFunction, oldData)
    );
  }

  // Add new elements
  else if (oldData?.length === 0 || oldData?.length === newData?.length) {
    const elements = newData.map(renderFunction);
    rootElem.append(...elements);
  }
}
function newElementsFn(
  renderFunction: renderFunction,
  length: number,
  item: any,
  i: number
) {
  return renderFunction(item, i + length);
}
function addNewOnes(
  rootElem: Element,
  renderFunction: renderFunction,
  oldData: Array<LooseObject>,
  item: any,
  i: number
) {
  if (!oldData.includes(item)) {
    rootElem.appendChild(renderFunction(item, i));
  }
}

function removeChild(
  rootElem: Element,
  newData: Array<LooseObject>,
  length: number,
  item: any,
  i: number
) {
  if (!newData.includes(item)) {
    item(null);
    rootElem.childNodes[length - i]?.remove();
  }
}

function updateDOM(value: any, receiver: any) {
  if (reactiveMap.has(receiver)) {
    const nodes = reactiveMap.get(receiver)!;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const [prop, oldVal] = nodeChangeMap.get(node)!;
      const nextVal = isObject(value) ? Reflect.get(value, prop) : value;

      // Check attributes and textContent
      let modified = false;
      if (!isTextNode(node) && (node as Element).outerHTML.includes(oldVal)) {
        modified = (node as Element)
          .getAttributeNames()
          .some(
            replaceAttribute.bind(
              replaceAttribute,
              node as Element,
              oldVal,
              nextVal
            )
          );
      }

      if (!modified) {
        node.textContent = node.textContent!.replace(oldVal, nextVal);
      }

      nodeChangeMap.set(node, [prop, nextVal]);
    }
  }
}

function replaceAttribute(
  element: Element,
  oldVal: string,
  nextVal: any,
  attr: string
) {
  const attrValue = element.getAttribute(attr);
  if (attrValue === oldVal) {
    element.setAttribute(attr, nextVal);
    return true;
  }
}

function schedule(fn: Function, ...args: any): void {
  //@ts-expect-error
  if (navigator.scheduling) {
    //@ts-expect-error
    if (navigator.scheduling.isInputPending()) {
      setTimeout(schedule, 0, fn, ...args);
    } else {
      fn(...args);
    }
  } else {
    //@ts-expect-error
    (requestIdleCallback || setTimeout)(fn.bind(fn, ...args));
  }
}

function getValue<T>(proxy: T): T {
  return Reflect.get(proxy as any, $value);
}

// Utility
function identity(something: any) {
  return something;
}
function idString(something: any) {
  return String(something);
}
function equals(a: any, b: any) {
  return a === b;
}
function randomText() {
  return Math.random().toString(32).slice(2);
}
function isObject(obj: any): obj is LooseObject {
  return obj != null && typeof obj === "object";
}
function deleteFromStack(binding: registerStackItem) {
  const idx = registerStack.findIndex(equals.bind(equals, binding));
  registerStack.splice(idx, 1);
}
function isTextNode(node: any): node is Text {
  return node.splitText !== undefined;
}
function isDocumentFragment(node: Node) {
  return node.nodeName !== "svg" && "getElementById" in node;
}

// Types

const enum Placeholder {
  function = "function",
}
type h = ReturnType<typeof document.createElement>;
type LooseObject = Record<PropertyKey, any>;
type registerStackItem = [LooseObject, string | symbol, any];
type renderFunction = (value: any, index: number) => Node;
type setterType = (newVal: any) => void;

export { h, reactive, render, observe, view, getValue };

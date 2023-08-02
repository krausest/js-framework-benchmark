import {
  A,
  addAfterRenderHook,
  addAppendChildHook,
  addAttributeHandler,
  appendChild,
  createElement,
  createTextNode,
  d,
  forEach,
  handler,
  isArray,
  matches,
  setAttribute,
  setCreateCompFunc,
} from "./rezact";

const subscribe = "subscribe";
const value = "value";
let batchSubs = [];
let batchUnsubs = [];
let batchTime = -1;
function resetBatchTimeout() {
  setTimeout(runBatch, 100);
}
function runBatch() {
  if (batchTime === -1 || Date.now() + 100 < batchTime)
    return resetBatchTimeout();
  batchSubs[forEach]((func) => func());
  const unsubsToDelete = [];
  batchUnsubs[forEach]((unsub, idx) => {
    if (!unsub.elm.isConnected) {
      unsub.func();
      unsubsToDelete.push(idx);
    }
  });
  for (let idx = unsubsToDelete.length - 1; idx > -1; idx--) {
    const subIdx = unsubsToDelete[idx];
    batchUnsubs.splice(subIdx, 1);
  }
  batchSubs = [];
  batchTime = -1;
  resetBatchTimeout();
}
resetBatchTimeout();

let unsubFunctionsArr: any = [];
let subscFunctionsArr: any = [];
console.debug(((window as any).totalSubscriberCount = 0));

function createSignalElement(elm: any): any {
  if (A[isArray](elm)) {
    const span = d[createElement]("span");
    elm.push(span);
    return span;
  }
  return elm;
}

setCreateCompFunc(_createComponent);
function _createComponent(tagName, attributes: any = null) {
  let previousSubscFuncs = subscFunctionsArr;
  subscFunctionsArr = [];
  let previousUnSubFuncs = unsubFunctionsArr;
  unsubFunctionsArr = [];

  const elm = tagName(attributes);

  let currentSubscItems = subscFunctionsArr;
  let currentUnsubItems = unsubFunctionsArr;

  if (currentSubscItems.length > 0) {
    const firstElm = createSignalElement(elm);
    attachSubs(firstElm, currentSubscItems, currentUnsubItems);
  }

  currentSubscItems = null;
  currentUnsubItems = null;

  subscFunctionsArr = previousSubscFuncs;
  unsubFunctionsArr = previousUnSubFuncs;

  previousSubscFuncs = null;
  previousSubscFuncs = null;

  return elm;
}

function attachSubs(elm, subs, unsubs) {
  batchSubs.push(...subs);
  unsubs[forEach]((func) => batchUnsubs.push({ elm, func})) 
  batchTime = Date.now();
}

export class BaseState {
  deps: any = null;
  state = true;
  computed = false;
  value: any = null;
  subs: any = [];

  constructor(st: any, opts: any = {}) {
    this[value] = st === null ? "" : st;
    this.computed = opts.computed || false;
    this.deps = opts.deps || null;
  }

  alertSubs(newVal: any) {
    this.subs[forEach]((sub: any) => {
      sub.func(newVal);
    });
  }

  setValue(newVal: any) {
    if (newVal === this[value] && !A[isArray](newVal)) return;
    if (
      this[value] instanceof Element &&
      newVal instanceof Element &&
      this[value] !== newVal &&
      this[value].parentNode
    )
      this[value].replaceWith(newVal);
    this[value] = newVal;
    this.alertSubs(newVal);
    batchTime = Date.now();
  }

  _subscribe(func: any, opts: any = {}) {
    console.debug((window as any).totalSubscriberCount++);
    const subObj = { func, ...opts };
    this.subs.push(subObj);
  }

  subscribe(func: any, opts: any = {}) {
    const subscFunc = () => {
      this._subscribe(func, opts);
      func(this[value]);
    };

    const unsubFunc = () => {
      this.unsubscribe(func);
    };

    if (opts.elm) {
      attachSubs(opts.elm, [subscFunc], [unsubFunc]);
      // subscFunc();
    } else {
      subscFunctionsArr.push(subscFunc);
      unsubFunctionsArr.push(unsubFunc);
    }

    return unsubFunc;
  }

  unsubscribe(funcToDelete: any) {
    const index = this.subs.findIndex((sub: any) => sub.func === funcToDelete);

    if (index === -1) return;

    console.debug((window as any).totalSubscriberCount--);
    this.subs.splice(index, 1);
  }
}

let arrPropsToAlertOn = [];
let handleArrProps = (_target, _prop, results, _alertProps) => results;
export const setArrPropsToAlertOn = (n) => (arrPropsToAlertOn = n);
export const setHandleArrProps = (n) => (handleArrProps = n);

const stateProxyHandler = {
  get(target: any, prop: any, receiver: any) {
    const origMethod = target[value][prop];
    if (typeof origMethod === "function") {
      return (...args: any) =>
        handleArrProps(
          target,
          prop,
          origMethod.apply(target[value], args),
          arrPropsToAlertOn
        );
    } else if (prop === "v") {
      return target[value];
    } else if (target[prop] === undefined) {
      return target[value][prop];
    } else {
      return Reflect.get(target, prop, receiver);
    }
  },
  set(target: any, prop: string, value: any, receiver: any) {
    if (prop === "v") {
      target.setValue(value);
      return true;
    } else {
      return Reflect.set(target, prop, value, receiver);
    }
  },
};

export function getNewProxiedState(
  defaultValue: any = "",
  StateClass: any = BaseState
) {
  const newState = new StateClass(defaultValue);
  const proxyState = new Proxy(newState, stateProxyHandler);
  return proxyState;
}

export function createComputed(func: (obj: any) => {}, deps: any[]) {
  const newState = new BaseState(func(deps), { computed: true, deps });
  deps[forEach]((dep) => {
    dep[subscribe](() => {
      newState.setValue(func(deps));
    });
  });
  const proxyState = new Proxy(newState, stateProxyHandler);
  return proxyState as any;
}

function handleStateTypes(parent: any, child: any) {
  const textTypes = ["string", "number"];
  if (textTypes.includes(typeof child[value])) {
    handleTextNode(parent, child);
  } else if (child[value] instanceof Node && !child.computed) {
    appendChild(parent, child[value]);
  } else if (child.computed) {
    const placeholder = d[createElement]("span");
    const newState = useSignal(placeholder);
    if (child[value] instanceof Node) newState.v = child[value];
    child[subscribe]((newVal: any) => {
      if (typeof newVal === "boolean") newState.v = placeholder;
      if (newVal instanceof Node) newState.v = newVal;
    });
    appendChild(parent, newState[value]);
  }
}

const childStateHandler = {
  [matches]: (child) => typeof child === "object" && child.state,
  [handler]: (parent, child) => handleStateTypes(parent, child),
};

addAppendChildHook(childStateHandler);

const attributeStateHandler = {
  [matches]: (_attrs, _key, attrVal) => attrVal.state,
  [handler]: (elm, key, attrVal) => {
    elm[setAttribute](key, attrVal[value]);
    attrVal[subscribe](
      (newVal: any) => {
        elm[setAttribute](key, newVal);
      },
      { elm }
    );
  },
};

addAttributeHandler(attributeStateHandler);

function handleTextNode(parent: any, child: any) {
  const txtNode = d[createTextNode](child[value].toString());
  child[subscribe]((newVal: any) => (txtNode.textContent = newVal.toString()), {
    elm: parent,
  });
  appendChild(parent, txtNode);
}

addAfterRenderHook(() => {
  subscFunctionsArr[forEach]((func: any) => func());
  subscFunctionsArr = [];
  unsubFunctionsArr = [];
});

export const useSignal = (st: any) => getNewProxiedState(st);

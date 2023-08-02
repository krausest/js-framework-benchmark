export const d: any = document;
export const A = Array;
export const isArray = "isArray";
export const forEach = "forEach";
export const createElement = "createElement";
export const createTextNode = "createTextNode";
export const matches = "matches";
export const handler = "handler";
export const setAttribute = "setAttribute";
export let createComponent = (tagName, attributes = null) =>
  tagName(attributes);

export const setCreateCompFunc = (func) => (createComponent = func);

export const elementFragHandler = {
  [matches]: (tagName) => tagName === xFragment,
  [handler]: (_tag, _attr, childs) => childs,
};

export const elementComponentHandler = {
  [matches]: (tagName) => typeof tagName === "function",
  [handler]: (tag, attrs, childs) => {
    attrs = attrs || {};
    attrs.children = childs;
    return createComponent(tag, attrs);
  },
};

export const elementDefaultHandler = {
  [matches]: () => true,
  [handler]: (tag, attrs, childs) => {
    const elm = d[createElement](tag);
    if (attrs) handleAttributes(elm, attrs);
    for (const child of childs) {
      appendChild(elm, child);
    }
    return elm;
  },
};

let elementHandlers = [
  elementFragHandler,
  elementComponentHandler,
  elementDefaultHandler,
];

export function xCreateElement(tagName, attributes, ...children) {
  for (const hook of elementHandlers) {
    if ((hook[matches] as any)(tagName))
      return (hook[handler] as any)(tagName, attributes, children);
  }
}

export const attributeEventHandler = {
  [matches]: (attrs, key) =>
    key.startsWith("on") && typeof attrs[key] === "function",
  [handler]: (elm, key, attrVal) =>
    elm.addEventListener(key.substring(2).toLowerCase(), attrVal),
};

export const attributeBoolHanlder = {
  [matches]: (_attrs, key) => typeof key === "boolean" && key,
  [handler]: (elm, key) => elm[setAttribute](key, ""),
};

export const attributeDefaultHandler = {
  [matches]: () => true,
  [handler]: (elm, key, attrVal) => elm[setAttribute](key, attrVal),
};
export let attributeHandlers = [
  attributeEventHandler,
  attributeBoolHanlder,
  attributeDefaultHandler,
];

export const addAttributeHandler = (item) => attributeHandlers.unshift(item);

function handleAttributes(elm, attrs) {
  for (const key of Object.keys(attrs)) {
    const attrVal = attrs[key];
    for (const hook of attributeHandlers) {
      if ((hook[matches] as any)(attrs, key, attrVal))
        (hook[handler] as any)(elm, key, attrVal, attrs);
    }
  }
}

export const childUndefinedHandler = {
  [matches]: (child) =>
    typeof child === "undefined" ||
    child === null ||
    typeof child === "boolean",
  [handler]: () => {},
};

export const childArrayHandler: any = {
  [matches]: (child) => A[isArray](child),
  [handler]: (parent, child) => {
    for (const value of child) {
      appendChild(parent, value);
    }
  },
};

export const childNodeHandler: any = {
  [matches]: (child) => child instanceof Node,
  [handler]: (parent, child) => parent.appendChild(child),
};

export const childDefaultHandler = {
  [matches]: () => true,
  [handler]: (parent, child) =>
    parent.appendChild(d[createTextNode](String(child))),
};

let appendChildHooks: any = [
  childUndefinedHandler,
  childArrayHandler,
  childNodeHandler,
  childDefaultHandler,
];

export const addAppendChildHook = (item) => appendChildHooks.unshift(item);

export let appendChild = (parent, child, ...args) => {
  for (const hook of appendChildHooks) {
    if ((hook[matches] as any)(child))
      return (hook[handler] as any)(parent, child, ...args);
  }
};

const afterRenderHooks = [];
export const addAfterRenderHook = (item) => afterRenderHooks.push(item);

export function render(root, tagName, attributes: any = {}) {
  const elm = createComponent(tagName, attributes);
  appendChild(root, elm);
  afterRenderHooks[forEach]((func) => func());
}
export const xFragment = [];

let handleInputValue = null;
export function useInputs() {
  if (handleInputValue) return;
  handleInputValue = true;
  function getInputVal(elm: HTMLInputElement) {
    const radioVal = elm.id || elm.value;
    if (elm.type === "radio" && elm.checked) return radioVal;
    if (elm.type === "radio" && !elm.checked) return "";
    if (elm.type === "checkbox") return elm.checked;
    if (elm.type === "number") return +elm.value;
    if (elm.value) return elm.value;
    return "";
  }

  function setInputVal(elm: any, val: any) {
    const radioVal = elm.id || elm.value;
    if (elm.type === "radio" && val === radioVal) return (elm.checked = true);
    if (elm.type === "radio" && val !== radioVal) return (elm.checked = false);
    if (elm.type === "checkbox") return (elm.checked = !!val);
    elm.value = val;
  }

  const handleInputAttr = (element, attributeValue, attributes) => {
    setInputVal(element, attributeValue.value);

    attributeValue.subscribe(
      (newVal: string) => {
        setInputVal(element, newVal);
      },
      { elm: element }
    );

    if (
      !Object.keys(attributes).includes("onChange") &&
      !Object.keys(attributes).includes("onInput")
    ) {
      const evType = element.type === "text" ? "input" : "change";
      element.addEventListener(evType, () => {
        attributeValue.setValue(getInputVal(element));
      });
    }
  };

  const attributeInputValueHandler = {
    [matches]: (_attrs, key, attrVal) =>
      key === "value" && attrVal.state && handleInputValue,
    [handler]: (elm, _key, attrVal, attrs) =>
      handleInputAttr(elm, attrVal, attrs),
  };

  addAttributeHandler(attributeInputValueHandler);
}

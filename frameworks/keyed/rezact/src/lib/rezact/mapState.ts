import {
  BaseState,
  getNewProxiedState,
  setArrPropsToAlertOn,
  setHandleArrProps,
  useSignal,
} from "./signals";
import {
  A,
  addAppendChildHook,
  appendChild,
  childArrayHandler,
  childNodeHandler,
  createComponent,
  d,
  handler,
  isArray,
  matches,
} from "./rezact";

setHandleArrProps((target, prop, results, alertProps) => {
  if (alertProps.includes(prop)) target.alertSubs(results);
  return results;
});

setArrPropsToAlertOn(["push", "pop", "splice", "shift", "unshift"]);

class MapState extends BaseState {
  constructor(st: any, opts: any = {}) {
    super(st, opts);
  }

  Map(func: any) {
    let idx: number = 0;
    const newArr = [];
    for (let item of this.value) {
      if (!item.state) this.value[idx] = item = useSignal(item);
      if (!item.idxState) {
        item.idxState = useSignal(0);
      }
      item.idxState.setValue(idx);

      const comp =
        item.comp || createComponent(() => func(item, item.idxState));

      A[isArray](comp)
        ? comp.forEach((elm) => (elm.associatedState = item))
        : (comp.associatedState = item);
      item.comp = comp;
      newArr.push(comp);
      idx += 1;
    }
    return newArr;
  }

  deleteValue(valToDelete: any) {
    const index = this.value.indexOf(valToDelete);
    if (index < 0) return;
    if (valToDelete.elmRef)
      appendChildNode(null, valToDelete.elmRef, false, true);
    this.value.splice(index, 1);
    this.alertSubs(index);
  }

  toJson() {
    return this.value.map((thisVal) =>
      thisVal.value !== undefined && thisVal.value !== null
        ? thisVal.value
        : thisVal
    );
  }
}

const handleArray = (parent: any, child: any) => {
  const parentNode = d.createComment("start map");
  const endNode = d.createComment("end map");
  parent.appendChild(parentNode);
  parent.appendChild(endNode);

  const addChildren = (values: any) => {
    const depArr = child.deps[0].value;
    const len = values.length;
    let nextNode = parentNode;
    for (let i = 0; i < len; i++) {
      depArr[i].elmRef = values[i];
      if (
        !(nextNode.nextSibling === (depArr[i].elmRef[0] || depArr[i].elmRef))
      ) {
        appendChild(nextNode, depArr[i].elmRef, true);
      }
      nextNode = A[isArray](depArr[i].elmRef)
        ? depArr[i].elmRef.at(-1)
        : depArr[i].elmRef;
    }
  };

  const removeStaleChildren = () => {
    const depArr = child.deps[0].value;
    const nodesToRemove = [];
    let nextNode: any = parentNode.nextSibling;
    let idx = 0;
    while (nextNode !== endNode) {
      if (depArr.indexOf(nextNode.associatedState) < 0) {
        nodesToRemove.push(nextNode);
      } else if (
        depArr[idx] &&
        !(nextNode === (depArr[idx]?.elmRef[0] || depArr[idx]?.elmRef))
      ) {
        nodesToRemove.push(depArr[idx].elmRef);
      }
      idx += 1;
      nextNode = nextNode.nextSibling;
    }
    nodesToRemove.forEach((node) => appendChild(null, node, false, true));
  };

  child.subscribe((newVal: any) => {
    removeStaleChildren();
    addChildren(newVal);
  });

  addChildren(child.value);
};

const childStateHandler = {
  [matches]: (child) => A[isArray](child.value) && child.state,
  [handler]: (parent, child) => handleArray(parent, child),
};

addAppendChildHook(childStateHandler);

function insertNodeAfter(currentNode: any, childNode: any) {
  if (currentNode.nextSibling) {
    currentNode.parentNode.insertBefore(childNode, currentNode.nextSibling);
  } else {
    currentNode.parentNode.appendChild(childNode);
  }
}

function appendChildNode(
  parentNode: any,
  childNode: any,
  insertAfter: boolean = false,
  removeElm: boolean = false
) {
  if (removeElm) return childNode.remove();
  insertAfter
    ? insertNodeAfter(parentNode, childNode)
    : parentNode.appendChild(childNode);
}

childNodeHandler[handler] = (parent, child, insertAfter, removeElm) =>
  appendChildNode(parent, child, insertAfter, removeElm);

childArrayHandler[handler] = (parent, child, insertAfter, removeElm) => {
  if (insertAfter) child = Array.isArray(child) ? [...child].reverse() : child;
  for (const value of child) {
    appendChild(parent, value, insertAfter, removeElm);
  }
};

export const useMapState = (st: any) => {
  return getNewProxiedState(st, MapState);
};

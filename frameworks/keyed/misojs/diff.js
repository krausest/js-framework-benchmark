/* virtual-dom diffing algorithm, applies patches as detected */
window = typeof window === 'undefined' ? {} : window;
window['diff'] = function diff(currentObj, newObj, parent, doc) {
  if (!currentObj && !newObj) return;
  else if (!currentObj && newObj) window['createNode'](newObj, parent, doc);
  else if (currentObj && !newObj) window['destroyNode'](currentObj, parent);
  else {
    if (currentObj.type === 'vtext') {
      if (newObj.type === 'vnode') window['replaceTextWithElement'](currentObj, newObj, parent, doc);
      else window['diffTextNodes'](currentObj, newObj);
    } else {
      if (newObj.type === 'vnode') window['diffVNodes'](currentObj, newObj, parent, doc);
      else window['replaceElementWithText'](currentObj, newObj, parent, doc);
    }
  }
};

window['destroyNode'] = function destroyNode(obj, parent) {
  window['callBeforeDestroyedRecursive'](obj);
  parent.removeChild(obj['domRef']);
  window['callDestroyedRecursive'](obj);
};

window['callDestroyedRecursive'] = function callDestroyedRecursive(obj) {
  window['callDestroyed'](obj);
  for (var i in obj.children)
    window['callDestroyedRecursive'](obj.children[i]);
};

window['callDestroyed'] = function callDestroyed(obj) {
  if (obj['onDestroyed']) obj['onDestroyed']();
};

window['callBeforeDestroyed'] = function callBeforeDestroyed(obj) {
  if (obj['onBeforeDestroyed']) obj['onBeforeDestroyed']();
};

window['callBeforeDestroyedRecursive'] = function callBeforeDestroyedRecursive(obj) {
  window['callBeforeDestroyed'](obj);
  for (var i in obj.children)
    window['callBeforeDestroyedRecursive'](obj.children[i]);
};

window['diffTextNodes'] = function diffTextNodes(c, n) {
  if (c['text'] !== n['text']) c['domRef'].textContent = n['text'];
  n['domRef'] = c['domRef'];
};

window['replaceElementWithText'] = function replaceElementWithText(c, n, parent, doc) {
  n['domRef'] = doc.createTextNode(n['text']);
  window['callBeforeDestroyedRecursive'](c);
  parent.replaceChild(n['domRef'], c['domRef']);
  window['callDestroyedRecursive'](c);
};

window['replaceTextWithElement'] = function replaceTextWithElement(c, n, parent, doc) {
  window['createElement'](n, doc);
  parent.replaceChild(n['domRef'], c['domRef']);
  window['callCreated'](n);
};

window['callCreated'] = function callCreated(obj) {
  if (obj['onCreated']) obj['onCreated']();
};

window['populate'] = function populate(c, n, doc) {
  if (!c) c = {
              props: null,
              css: null,
              children: []
              }
  window['diffProps'](c['props'], n['props'], n['domRef'], n['ns'] === 'svg');
  window['diffCss'](c['css'], n['css'], n['domRef']);
  window['diffChildren'](c['children'], n['children'], n['domRef'], doc);
};

window['diffVNodes'] = function diffVNodes(c, n, parent, doc) {
  if (c['tag'] === n['tag'] && n['key'] === c['key']) {
    n['domRef'] = c['domRef'];
    window['populate'](c, n, doc);
  } else {
    window['createElement'](n, doc);
    window['callBeforeDestroyedRecursive'](c);
    parent.replaceChild(n['domRef'], c['domRef']);
    window['callDestroyedRecursive'](c);
    window['callCreated'](n);
  }
};

window['diffProps'] = function diffProps(cProps, nProps, node, isSvg) {
  var result, newProp;
  /* Is current prop in new prop list? */
  for (var c in cProps) {
    newProp = nProps[c];
    /* If current property no longer exists, remove it */
    if (!newProp) {
      /* current key is not in node, remove it from DOM, if SVG, remove attribute */
      if (isSvg || !(c in node))
        node.removeAttribute(c, cProps[c]);
      else
        node[c] = '';
    } else {
      /* Already on DOM from previous diff, continue */
      if (newProp === cProps[c]) continue;
      if (isSvg) {
        if (c === 'href')
          node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newProp);
        else
          node.setAttribute(c, newProp);
      } else if (c in node && !(c === 'list' || c === 'form')) {
        node[c] = newProp;
      } else {
        node.setAttribute(c, newProp);
      }
    }
  }
  /* add remaining */
  for (var n in nProps) {
    if (cProps && cProps[n]) continue;
    newProp = nProps[n];
    /* Only add new properties, skip (continue) if they already exist in current property map */
    if (isSvg) {
      if (n === 'href')
        node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newProp);
      else
        node.setAttribute(n, newProp);
    } else if (n in node && !(n === 'list' || n === 'form')) {
      node[n] = nProps[n];
    } else {
      node.setAttribute(n, newProp);
    }
  }
};

window['diffCss'] = function diffCss(cCss, nCss, node) {
  var result;
  /* is current attribute in new attribute list? */
  for (var c in cCss) {
    result = nCss[c];
    if (!result) {
      /* current key is not in node */
      node.style[c] = null;
    } else if (result !== cCss[c]) {
      node.style[c] = result;
    }
  }
  /* add remaining */
  for (var n in nCss) {
    if (cCss && cCss[n]) continue;
    node.style[n] = nCss[n];
  }
};

window['hasKeys'] = function hasKeys(ns, cs) {
  return ns.length > 0 && cs.length > 0 && ns[0]['key'] != null && cs[0]['key'] != null;
};

window['diffChildren'] = function diffChildren(cs, ns, parent, doc) {
  var longest = ns.length > cs.length ? ns.length : cs.length;
  if (window['hasKeys'](ns, cs)) {
    window['syncChildren'](cs, ns, parent, doc);
  } else {
    for (var i = 0; i < longest; i++)
      window['diff'](cs[i], ns[i], parent, doc);
  }
};

window['createElement'] = function createElement(obj, doc) {
  if (obj['ns'] === 'svg') {
    obj['domRef'] = doc.createElementNS('http://www.w3.org/2000/svg', obj['tag']);
  } else if (obj['ns'] === 'mathml') {
    obj['domRef'] = doc.createElementNS('http://www.w3.org/1998/Math/MathML', obj['tag']);
  } else {
    obj['domRef'] = doc.createElement(obj['tag']);
  }
  window['populate'](null, obj, doc);
};

window['createNode'] = function createNode(obj, parent, doc) {
  if (obj.type === 'vnode') window['createElement'](obj, doc);
  else obj['domRef'] = doc.createTextNode(obj['text']);
  parent.appendChild(obj['domRef']);
  window['callCreated'](obj);
};

/* Child reconciliation algorithm, inspired by kivi and Bobril */
window['syncChildren'] = function syncChildren(os, ns, parent, doc) {
  var oldFirstIndex = 0,
  newFirstIndex = 0,
  oldLastIndex = os.length - 1,
  newLastIndex = ns.length - 1,
  nFirst, nLast, oLast, oFirst, tmp, found, node;
  for (;;) {
    /* check base case, first > last for both new and old
      [ ] -- old children empty (fully-swapped)
      [ ] -- new children empty (fully-swapped)
    */
    if (newFirstIndex > newLastIndex && oldFirstIndex > oldLastIndex) {
      break;
    }

    /* Initialize */
    nFirst = ns[newFirstIndex];
    nLast = ns[newLastIndex];
    oFirst = os[oldFirstIndex];
    oLast = os[oldLastIndex];
    /* No more old nodes, create and insert all remaining nodes
       -> [ ] <- old children
       -> [ a b c ] <- new children
    */
    if (oldFirstIndex > oldLastIndex) {
      window['diff'](null, nFirst, parent, doc);
      /* insertBefore's semantics will append a node if the second argument provided is `null` or `undefined`.
         Otherwise, it will insert node['domRef'] before oLast['domRef']. */
      if (!oLast) {
        parent.insertBefore(nFirst['domRef'], oFirst['domRef']);
      } else {
        parent.insertBefore(oLast['domRef'], nFirst['domRef']);
      }
      os.splice(newFirstIndex, 0, nFirst);
      newFirstIndex++;
    }
    /* No more new nodes, delete all remaining nodes in old list
       -> [ a b c ] <- old children
       -> [ ] <- new children
    */
    else if (newFirstIndex > newLastIndex) {
      tmp = oldLastIndex - oldFirstIndex;
      while (tmp >= 0) {
        parent.removeChild(os[oldFirstIndex]['domRef']);
        os.splice(oldFirstIndex, 1);
        tmp--;
      }
      break;
    }
    /* happy path, everything aligns, we continue
       -> oldFirstIndex -> [ a b c ] <- oldLastIndex
       -> newFirstIndex -> [ a b c ] <- newLastIndex
       check if nFirst and oFirst align, if so, check nLast and oLast
    */
    else if (oFirst['key'] === nFirst['key']) {
      window['diff'](os[oldFirstIndex++], ns[newFirstIndex++], parent, doc);
    } else if (oLast['key'] === nLast['key']) {
      window['diff'](os[oldLastIndex--], ns[newLastIndex--], parent, doc);
    }
    /* flip-flop case, nodes have been swapped, in some way or another
       both could have been swapped.
       -> [ a b c ] <- old children
       -> [ c b a ] <- new children
    */
    else if (oFirst['key'] === nLast['key'] && nFirst['key'] === oLast['key']) {
      window['swapDomRefs'](node, oFirst['domRef'], oLast['domRef'], parent);
      window['swap'](os, oldFirstIndex, oldLastIndex);
      window['diff'](os[oldFirstIndex++], ns[newFirstIndex++], parent, doc);
      window['diff'](os[oldLastIndex--], ns[newLastIndex--], parent, doc);
    }
    /* Or just one could be swapped (d's align here)
           This is top left and bottom right match case.
           We move d to end of list, mutate old vdom to reflect the change
           We then continue without affecting indexes, hoping to land in a better case
           -> [ d a b ] <- old children
           -> [ a b d ] <- new children
           becomes
           -> [ a b d ] <- old children
           -> [ a b d ] <- new children
           and now we happy path
       */
    else if (oFirst['key'] === nLast['key']) {
      /* insertAfter */
      parent.insertBefore(oFirst['domRef'], oLast['domRef'].nextSibling);
      /* swap positions in old vdom */
      os.splice(oldLastIndex,0,os.splice(oldFirstIndex,1)[0]);
      window['diff'](os[oldLastIndex--], ns[newLastIndex--], parent, doc);
    }
    /* This is top right and bottom lefts match case.
       We move d to end of list, mutate old vdom to reflect the change
       -> [ b a d ] <- old children
       -> [ d b a ] <- new children
       becomes
       -> [ d b a ] <- old children
       -> [ d b a ] <- new children
       and now we happy path
    */
    else if (oLast['key'] === nFirst['key']) {
      /* insertAfter */
      parent.insertBefore(oLast['domRef'], oFirst['domRef']);
      /* swap positions in old vdom */
      os.splice(oldFirstIndex,0, os.splice(oldLastIndex,1)[0]);
      window['diff'](os[oldFirstIndex++], nFirst, parent, doc);
      newFirstIndex++;
    }

    /* The 'you're screwed' case, nothing aligns, pull the ripcord, do something more fancy
       This can happen when the list is sorted, for example.
       -> [ a e c ] <- old children
       -> [ b e d ] <- new children
    */
    else {
      /* final case, perform linear search to check if new key exists in old map, decide what to do from there */
      found = false;
      tmp = oldFirstIndex;
      while (tmp <= oldLastIndex) {
        if (os[tmp]['key'] === nFirst['key']) {
          found = true;
          node = os[tmp];
          break;
        }
        tmp++;
      }
          /* If new key was found in old map this means it was moved, hypothetically as below
         -> [ a e b c ] <- old children
         -> [ b e a j ] <- new children
          ^
         In the above case 'b' has been moved, so we need to insert 'b' before 'a' in both vDOM and DOM
         We also increase oldFirstIndex and newFirstIndex.

         This results in new list below w/ updated index position
         -> [ b a e c ] <- old children
         -> [ b e a j ] <- new children
            ^
      */
      if (found) {
        /* Move item to correct position */
        os.splice(oldFirstIndex,0, os.splice(tmp,1)[0]);
        /* Swap DOM references */
        parent.insertBefore(node['domRef'], os[oldFirstIndex]['domRef']);
        /* optionally perform `diff` here */
        window['diff'](os[oldFirstIndex++], nFirst, parent, doc);
        /* increment counters */
        newFirstIndex++;
      }
        /* If new key was *not* found in the old map this means it must now be created, example below
           -> [ a e d c ] <- old children
           -> [ b e a j ] <- new children
            ^

           In the above case 'b' does not exist in the old map, so we create a new element and DOM reference.
           We then insertBefore in both vDOM and DOM.

           -> [ b a e d c ] <- old children
           -> [ b e a j   ] <- new children
              ^
           */
      else {
        window['createElement'](nFirst, doc);
        parent.insertBefore(nFirst['domRef'], oFirst['domRef']);
        os.splice(oldFirstIndex++, 0, nFirst);
        newFirstIndex++;
        oldLastIndex++;
      }
    }
  }
};

window['swapDomRefs'] = function swapDomRefs(tmp,a,b,p) {
  tmp = a.nextSibling;
  p.insertBefore(a,b);
  p.insertBefore(b,tmp);
};

window['swap']= function swap(os,l,r) {
  var k = os[l];
  os[l] = os[r];
  os[r] = k;
};

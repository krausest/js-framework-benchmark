/* Vela compiler-generated js-framework-benchmark keyed entry. Source: src/BenchmarkTable.vela */

function __velaMarkSsr(__html, __component) { return String(__html ?? '').replace(/<([A-Za-z][A-Za-z0-9:-]*)(\s|>)/, (_m, __tag, __tail) => '<' + __tag + ' data-vela-ssr="1" data-vela-comp="' + __component + '"' + __tail); }
function renderBenchmarkTable(props = {}) {
  const rows = props["rows"];
  const selected = props["selected"];
  let __html = "";
  __html += "\n    ";
  __html += "<tbody";
  __html += ">";
  __html += "\n      ";
  __html += "<!--vela:b0:start-->";
  { const __list = (rows) ?? []; for (let i = 0; i < __list.length; i++) { const row = __list[i]; const __velaKey = encodeURIComponent(String(row.id));
    __html += "<!--vela-item:b0:" + __velaKey + ":start-->";
    __html += "\n        ";
    __html += "<tr";
    __html += __attr("class", selected === row.id ? 'danger' : '');
    __html += ">";
    __html += "\n          ";
    __html += "<td class=\"col-md-1\"";
    __html += ">";
    __html += __e(String((row.id) ?? ""));
    __html += "</td>";
    __html += "\n          ";
    __html += "<td class=\"col-md-4\"";
    __html += ">";
    __html += "<a";
    __html += ">";
    __html += __e(String((row.label) ?? ""));
    __html += "</a>";
    __html += "</td>";
    __html += "\n          ";
    __html += "<td class=\"col-md-1\"";
    __html += ">";
    __html += "<a";
    __html += ">";
    __html += "<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"";
    __html += ">";
    __html += "</span>";
    __html += "</a>";
    __html += "</td>";
    __html += "\n          ";
    __html += "<td class=\"col-md-6\"";
    __html += ">";
    __html += "</td>";
    __html += "\n        ";
    __html += "</tr>";
    __html += "\n      ";
    __html += "<!--vela-item:b0:" + __velaKey + ":end-->";
  } }
  __html += "<!--vela:b0:end-->";
  __html += "\n    ";
  __html += "</tbody>";
  __html += "\n  ";
  return __velaMarkSsr(__html, "BenchmarkTable");
}
const __BenchmarkTableBindingFns = {
  "b1": (__props, __state) => {
    const rows = __props["rows"];
    const selected = __props["selected"];
    return (selected === row.id ? 'danger' : '');
  },
  "b2": (__props, __state) => {
    const rows = __props["rows"];
    const selected = __props["selected"];
    return (String((row.id) ?? ""));
  },
  "b3": (__props, __state) => {
    const rows = __props["rows"];
    const selected = __props["selected"];
    return (String((row.label) ?? ""));
  },
};
const __BenchmarkTableEventFns = {
};
let __velaSkel_BenchmarkTable_b0 = null;
const __BenchmarkTableListFns = {
  "b0": {
    list: (__props, __state) => {
      const rows = __props["rows"];
      const selected = __props["selected"];
      return (rows) ?? [];
    },
    key: (__item, __i, __props, __state) => {
      const row = __item;
      const i = __i;
      const rows = __props["rows"];
      const selected = __props["selected"];
      return (row.id);
    },
    create: (__item, __i, __props, __state, __bindingId, __key) => {
      const __start = document.createComment(`vela-item:${__bindingId}:${encodeURIComponent(String(__key))}:start`);
      const __end = document.createComment(`vela-item:${__bindingId}:${encodeURIComponent(String(__key))}:end`);
      const row = __item;
      const i = __i;
      const rows = __props["rows"];
      const selected = __props["selected"];
      if (!__velaSkel_BenchmarkTable_b0) {
        const __sk0 = document.createElement("tr");
        __sk0.appendChild(document.createTextNode("\n          "));
        const __sk1 = document.createElement("td");
        __sk1.className = "col-md-1";
        __sk0.appendChild(__sk1);
        __sk0.appendChild(document.createTextNode("\n          "));
        const __sk2 = document.createElement("td");
        __sk2.className = "col-md-4";
        const __sk3 = document.createElement("a");
        __sk2.appendChild(__sk3);
        __sk0.appendChild(__sk2);
        __sk0.appendChild(document.createTextNode("\n          "));
        const __sk4 = document.createElement("td");
        __sk4.className = "col-md-1";
        const __sk5 = document.createElement("a");
        const __sk6 = document.createElement("span");
        __sk6.className = "glyphicon glyphicon-remove";
        __sk6.setAttribute("aria-hidden", "true");
        __sk5.appendChild(__sk6);
        __sk4.appendChild(__sk5);
        __sk0.appendChild(__sk4);
        __sk0.appendChild(document.createTextNode("\n          "));
        const __sk7 = document.createElement("td");
        __sk7.className = "col-md-6";
        __sk0.appendChild(__sk7);
        __sk0.appendChild(document.createTextNode("\n        "));
        __velaSkel_BenchmarkTable_b0 = __sk0;
      }
      const __root = __velaSkel_BenchmarkTable_b0.cloneNode(true);
      { const __v = (selected === row.id ? 'danger' : ''); if (__v !== false && __v != null) __root.className = String(__v); }
      __root.children[0].textContent = String((row.id) ?? "");
      __root.children[1].children[0].textContent = String((row.label) ?? "");
      return [__start, __root, __end];
    },
    render: (__item, __i, __props, __state) => {
      const row = __item;
      const i = __i;
      const rows = __props["rows"];
      const selected = __props["selected"];
      let __html = "";
      __html += "\n        ";
      __html += "<tr";
      __html += __attr("class", selected === row.id ? 'danger' : '');
      __html += ">";
      __html += "\n          ";
      __html += "<td class=\"col-md-1\"";
      __html += ">";
      __html += __e(String((row.id) ?? ""));
      __html += "</td>";
      __html += "\n          ";
      __html += "<td class=\"col-md-4\"";
      __html += ">";
      __html += "<a";
      __html += ">";
      __html += __e(String((row.label) ?? ""));
      __html += "</a>";
      __html += "</td>";
      __html += "\n          ";
      __html += "<td class=\"col-md-1\"";
      __html += ">";
      __html += "<a";
      __html += ">";
      __html += "<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"";
      __html += ">";
      __html += "</span>";
      __html += "</a>";
      __html += "</td>";
      __html += "\n          ";
      __html += "<td class=\"col-md-6\"";
      __html += ">";
      __html += "</td>";
      __html += "\n        ";
      __html += "</tr>";
      __html += "\n      ";
      return __html;
    }
  },
};
function __mountBenchmarkTableRowBank(target, props = {}) {
  target.textContent = "";
  const __rootTpl = document.createElement("template");
  __rootTpl.innerHTML = "<tbody></tbody>";
  const __root = __rootTpl.content.firstElementChild.cloneNode(true);
  const __nodeAt = (__root, __parts) => { let __node = __root; for (let __i = 0; __i < __parts.length; __i++) __node = __node.childNodes[__parts[__i]]; return __node; };
  const __container = __nodeAt(__root, []);
  target.appendChild(__root);
  const __region = __createBenchmarkTableRowBankRegion(__container, props);
  const __sync = (__props) => { __region.sync((__props["rows"]) ?? [], __props); };
  __sync(props);
  return { update(next) { if (next) Object.assign(props, next); __sync(props); }, clear() { __region.clear(props); }, stats() { return __region.stats(); }, destroy() { target.textContent = ""; __region.destroy(); } };
}
function __hydrateBenchmarkTableRowBank(target, props = {}) {
  const __root = target.firstElementChild;
  const __nodeAt = (__root, __parts) => { let __node = __root; for (let __i = 0; __i < __parts.length; __i++) __node = __node.childNodes[__parts[__i]]; return __node; };
  const __container = __nodeAt(__root, []);
  const __region = __createBenchmarkTableRowBankRegion(__container, props);
  const __sync = (__props) => { __region.sync((__props["rows"]) ?? [], __props); };
  __region.hydrate((props["rows"]) ?? [], props);
  return { update(next) { if (next) Object.assign(props, next); __sync(props); }, clear() { __region.clear(props); }, stats() { return __region.stats(); }, destroy() { target.textContent = ""; __region.destroy(); } };
}
function __createBenchmarkTableRowBankRegion(__container, __initialProps = {}) {
  const __bank = new Map();
  let __rows = [];
  let __keys = [];
  let __entries = [];
  let __tick = 0;
  let __selected = __initialProps["selected"];
  let __rowUpdates = 0;
  let __bindingsEvaluated = 0;
  const __maxBank = (__props, __activeCount = 0) => Math.max(__activeCount, Math.max(0, Number(__props.__velaMaxBank ?? __initialProps.__velaMaxBank ?? 4096)));
  const __setRegion = (__r, __html) => { __html = String(__html ?? ""); if (__r.html === __html) return; let __n = __r.start.nextSibling; while (__n && __n !== __r.end) { const __next = __n.nextSibling; __n.remove(); __n = __next; } if (__html) { const __tpl = document.createElement("template"); __tpl.innerHTML = __html; __r.end.parentNode.insertBefore(__tpl.content, __r.end); } __r.html = __html; };
  const __makeEntryDirect = () => {
    const __entry = { root: null, key: undefined, lastUsed: 0 };
    const __n0 = document.createElement("tr");
    __entry["rb0"] = __n0;
    const __n1 = document.createElement("td");
    __n1.className = "col-md-1";
    __n0.appendChild(__n1);
    const __n2 = document.createTextNode("");
    __entry["rb1"] = __n2;
    __n1.appendChild(__n2);
    const __n3 = document.createElement("td");
    __n3.className = "col-md-4";
    __n0.appendChild(__n3);
    const __n4 = document.createElement("a");
    __n3.appendChild(__n4);
    const __n5 = document.createTextNode("");
    __entry["rb2"] = __n5;
    __n4.appendChild(__n5);
    const __n6 = document.createElement("td");
    __n6.className = "col-md-1";
    __n0.appendChild(__n6);
    const __n7 = document.createElement("a");
    __n6.appendChild(__n7);
    const __n8 = document.createElement("span");
    __n8.className = "glyphicon glyphicon-remove";
    __n8.setAttribute("aria-hidden", "true");
    __n7.appendChild(__n8);
    const __n9 = document.createElement("td");
    __n9.className = "col-md-6";
    __n0.appendChild(__n9);
    __entry.root = __n0;
    return __entry;
  };
  const __rowTpl = document.createElement("tr");
  __rowTpl.innerHTML = "<td class=\"col-md-1\">​</td><td class=\"col-md-4\"><a>​</a></td><td class=\"col-md-1\"><a><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a></td><td class=\"col-md-6\"></td>";
  const __makeEntryTemplate = () => {
    const __root = __rowTpl.cloneNode(true);
    const __entry = { root: __root, key: undefined, lastUsed: 0 };
    __entry["rb0"] = __root;
    __entry["rb1"] = __root.childNodes[0].childNodes[0];
    __entry["rb2"] = __root.childNodes[1].childNodes[0].childNodes[0];
    return __entry;
  };
  let __preferTemplate = true;
  const __makeEntry = () => (__preferTemplate ? __makeEntryTemplate() : __makeEntryDirect());
  const __hydrate = (__root) => {
    const __entry = { root: __root, key: undefined };
    __entry["rb0"] = __root;
    __entry["rb1"] = __root.childNodes[0].childNodes[0];
    __entry["rb2"] = __root.childNodes[1].childNodes[0].childNodes[0];
    return __entry;
  };
  const __key = (__row, __i, __props) => {
    const row = __row;
    return row.id;
  };
  const __init = (__entry, __row, __i, __props) => {
    const row = __row;
    const selected = __props["selected"];
    let __v;
    __v = (selected === row.id ? 'danger' : ''); if (__v !== false && __v != null && __v !== "") __entry["rb0"].className = String(__v);
    __v = (row.id); __entry["rb1"].nodeValue = __v == null ? "" : __v;
    __v = (row.label); __entry["rb2"].nodeValue = __v == null ? "" : __v;
    __entry.__rp0 = __row.id;
    __entry.__rp1 = __row.label;
    __entry.__selected = __props["selected"];
  };
  const __update = (__entry, __row, __i, __props) => {
    const row = __row;
    const selected = __props["selected"];
    let __v;
    __rowUpdates++;
    __v = (selected === row.id ? 'danger' : ''); if (__v === false || __v == null || __v === "") { if (__entry["rb0"].className !== "") __entry["rb0"].className = ""; } else { __v = String(__v); if (__entry["rb0"].className !== __v) __entry["rb0"].className = __v; }
    __bindingsEvaluated++;
    __v = (row.id); { const __n = __entry["rb1"], __p = __n.nodeValue, __s = __v == null ? "" : String(__v); if (__p !== __s) { if (__s.length > __p.length && __s.slice(0, __p.length) === __p) __n.appendData(__s.slice(__p.length)); else __n.nodeValue = __s; } }
    __bindingsEvaluated++;
    __v = (row.label); { const __n = __entry["rb2"], __p = __n.nodeValue, __s = __v == null ? "" : String(__v); if (__p !== __s) { if (__s.length > __p.length && __s.slice(0, __p.length) === __p) __n.appendData(__s.slice(__p.length)); else __n.nodeValue = __s; } }
    __bindingsEvaluated++;
    __entry.__selected = __props["selected"];
  };
  const __updatePartial = (__entry, __row, __prev, __i, __props) => {
    const row = __row;
    const selected = __props["selected"];
    let __v;
    const __full = !__prev;
    const __sameRef = __prev === __row;
    let __changed_0 = __full;
    let __changed_1 = __full;
    const __selectedChanged = __props["selected"] !== __entry.__selected;
    if (!__full) {
      __changed_0 = __row.id !== (__sameRef ? __entry.__rp0 : __prev.id);
      __changed_1 = __row.label !== (__sameRef ? __entry.__rp1 : __prev.label);
    }
    if (!(__full || __changed_0 || __changed_1 || __selectedChanged)) return;
    __rowUpdates++;
    if (__full || __changed_0 || __selectedChanged) {
      __v = (selected === row.id ? 'danger' : ''); if (__v === false || __v == null || __v === "") { if (__entry["rb0"].className !== "") __entry["rb0"].className = ""; } else { __v = String(__v); if (__entry["rb0"].className !== __v) __entry["rb0"].className = __v; }
      __bindingsEvaluated++;
    }
    if (__full || __changed_0) {
      __v = (row.id); { const __n = __entry["rb1"], __p = __n.nodeValue, __s = __v == null ? "" : String(__v); if (__p !== __s) { if (__s.length > __p.length && __s.slice(0, __p.length) === __p) __n.appendData(__s.slice(__p.length)); else __n.nodeValue = __s; } }
      __bindingsEvaluated++;
    }
    if (__full || __changed_1) {
      __v = (row.label); { const __n = __entry["rb2"], __p = __n.nodeValue, __s = __v == null ? "" : String(__v); if (__p !== __s) { if (__s.length > __p.length && __s.slice(0, __p.length) === __p) __n.appendData(__s.slice(__p.length)); else __n.nodeValue = __s; } }
      __bindingsEvaluated++;
    }
    if (__full || __changed_0) __entry.__rp0 = __row.id;
    if (__full || __changed_1) __entry.__rp1 = __row.label;
    __entry.__selected = __props["selected"];
  };
  const __keysFor = (__list, __props) => {
    const __out = new Array(__list.length);
    for (let __i = 0; __i < __list.length; __i++) {
      const __row = __list[__i];
      const row = __row;
      __out[__i] = row.id;
    }
    return __out;
  };
  const __prune = (__props) => { if (__bank.size <= __keys.length) return; const __limit = __maxBank(__props, __keys.length); if (__bank.size <= __limit) return; const __active = new Set(__keys); const __victims = [...__bank.entries()].filter(([__k]) => !__active.has(__k)).sort((__a, __b) => (__a[1].lastUsed || 0) - (__b[1].lastUsed || 0)); for (const [__k, __entry] of __victims) { if (__bank.size <= __limit) break; __entry.root.remove(); __bank.delete(__k); } };
  const __entryFor = (__row, __i, __props) => { const __k = __key(__row, __i, __props); let __entry = __bank.get(__k); if (!__entry) { __entry = __makeEntry(); __entry.key = __k; __bank.set(__k, __entry); __init(__entry, __row, __i, __props); } else { const __prev = __entry.item; __updatePartial(__entry, __row, __prev, __i, __props); } __entry.item = __row; __entry.index = __i; __entry.lastUsed = ++__tick; __entries[__i] = __entry; return __entry; };
  const __appendBatch = (__list, __start, __props) => { const __prevPrefer = __preferTemplate; __preferTemplate = (__list.length - __start) >= 256; const __detachParent = __start === 0 && !__container.firstChild ? __container.parentNode : null; const __detachNext = __detachParent ? __container.nextSibling : null; if (__detachParent) __container.remove(); for (let __i = __start; __i < __list.length; __i++) __container.appendChild(__entryFor(__list[__i], __i, __props).root); if (__detachParent) __detachParent.insertBefore(__container, __detachNext); __preferTemplate = __prevPrefer; __selected = __props["selected"]; };
  const __appendColdBatch = (__list, __start, __props) => {
    const __prevPrefer = __preferTemplate;
    __preferTemplate = (__list.length - __start) >= 256;
    const __detachParent = __start === 0 && !__container.firstChild ? __container.parentNode : null;
    const __detachNext = __detachParent ? __container.nextSibling : null;
    if (__detachParent) __container.remove();
    for (let __i = __start; __i < __list.length; __i++) {
      const __row = __list[__i];
      const row = __row;
      const selected = __props["selected"];
      const __k = row.id;
      const __entry = __makeEntry();
      __entry.key = __k; __entry.item = __row; __entry.index = __i; __entry.lastUsed = ++__tick; __bank.set(__k, __entry); __entries[__i] = __entry;
      let __v;
      __v = (selected === row.id ? 'danger' : ''); if (__v !== false && __v != null && __v !== "") __entry["rb0"].className = String(__v);
      __v = (row.id); __entry["rb1"].nodeValue = __v == null ? "" : __v;
      __v = (row.label); __entry["rb2"].nodeValue = __v == null ? "" : __v;
      __entry.__rp0 = __row.id;
      __entry.__rp1 = __row.label;
      __entry.__selected = __props["selected"];
      __container.appendChild(__entry.root);
    }
    __preferTemplate = __prevPrefer;
    if (__detachParent) __detachParent.insertBefore(__container, __detachNext);
    __selected = __props["selected"];
  };
  const __appendFreshBatch = (__list, __start, __props) => {
    const __count = __list.length - __start;
    const __freshKeys = new Array(__count);
    for (let __i = __start; __i < __list.length; __i++) {
      const __row = __list[__i];
      const row = __row;
      const __k = row.id;
      if (__bank.has(__k)) return null;
      __freshKeys[__i - __start] = __k;
    }
    const __prevPrefer = __preferTemplate;
    __preferTemplate = __count >= 256;
    for (let __i = __start; __i < __list.length; __i++) {
      const __row = __list[__i];
      const row = __row;
      const selected = __props["selected"];
      const __entry = __makeEntry();
      const __k = __freshKeys[__i - __start];
      __entry.key = __k; __entry.item = __row; __entry.index = __i; __entry.lastUsed = ++__tick; __bank.set(__k, __entry); __entries[__i] = __entry;
      let __v;
      __v = (selected === row.id ? 'danger' : ''); if (__v !== false && __v != null && __v !== "") __entry["rb0"].className = String(__v);
      __v = (row.id); __entry["rb1"].nodeValue = __v == null ? "" : __v;
      __v = (row.label); __entry["rb2"].nodeValue = __v == null ? "" : __v;
      __entry.__rp0 = __row.id;
      __entry.__rp1 = __row.label;
      __entry.__selected = __props["selected"];
      __container.appendChild(__entry.root);
    }
    __preferTemplate = __prevPrefer;
    __selected = __props["selected"];
    return __freshKeys;
  };
  const __sameOrder = (__nextKeys) => { if (__nextKeys.length !== __keys.length) return false; for (let __i = 0; __i < __keys.length; __i++) if (__nextKeys[__i] !== __keys[__i]) return false; return true; };
  const __samePrefix = (__nextKeys) => { if (__nextKeys.length < __keys.length) return false; for (let __i = 0; __i < __keys.length; __i++) if (__nextKeys[__i] !== __keys[__i]) return false; return true; };
  const __patchSame = (__list, __props) => { const __nextSelected = __props["selected"], __sameList = __list === __rows; if (__sameList && __nextSelected !== __selected) { const __old = __bank.get(__selected); const __now = __bank.get(__nextSelected); __selected = __nextSelected; if (__old) __update(__old, __old.item, __old.index, __props); if (__now && __now !== __old) __update(__now, __now.item, __now.index, __props); return; } const __selChanged = __nextSelected !== __selected; for (let __i = 0; __i < __list.length; __i++) { if (__sameList || __selChanged || __list[__i] !== __rows[__i]) __entryFor(__list[__i], __i, __props); } __selected = __nextSelected; __rows = __list; };
  const __renderAll = (__list, __nextKeys, __props) => { __container.textContent = ""; __entries = []; (__bank.size === 0 ? __appendColdBatch : __appendBatch)(__list, 0, __props); __rows = __list; __keys = __nextKeys; __selected = __props["selected"]; };
  const __removeOne = (__list, __nextKeys, __props) => { if (__nextKeys.length !== __keys.length - 1) return false; let __p = 0; while (__p < __nextKeys.length && __keys[__p] === __nextKeys[__p]) __p++; for (let __j = __p; __j < __nextKeys.length; __j++) if (__keys[__j + 1] !== __nextKeys[__j]) return false; const __child = __container.children[__p]; if (__child) __child.remove(); __entries.splice(__p, 1); for (let __j = __p; __j < __list.length; __j++) __entryFor(__list[__j], __j, __props); __rows = __list; __keys = __nextKeys; return true; };
  const __touchMoved = (__row, __i, __k, __props) => { const __entry = __entries[__i]; if (!__entry || __entry.key !== __k || __props["selected"] !== __selected) { __entryFor(__row, __i, __props); return; } __entry.item = __row; __entry.index = __i; __entry.lastUsed = ++__tick; };
  const __swapKnownTwo = (__list, __a, __b, __props) => { if (__a < 0 || __b < 0 || __a >= __keys.length || __b >= __keys.length || __a === __b) return false; const __ka = __key(__list[__a], __a, __props), __kb = __key(__list[__b], __b, __props); if (__ka !== __keys[__b] || __kb !== __keys[__a]) return false; const __entryA = __entries[__a], __entryB = __entries[__b], __A = __entryA && __entryA.root, __B = __entryB && __entryB.root; if (!__A || !__B) return false; const __afterA = __A.nextSibling, __afterB = __B.nextSibling; __container.insertBefore(__B, __afterA); __container.insertBefore(__A, __afterB); __entries[__a] = __entryB; __entries[__b] = __entryA; if (__props["selected"] !== __selected) { __touchMoved(__list[__a], __a, __ka, __props); __touchMoved(__list[__b], __b, __kb, __props); } else { __entryB.item = __list[__a]; __entryB.index = __a; __entryB.lastUsed = ++__tick; __entryA.item = __list[__b]; __entryA.index = __b; __entryA.lastUsed = ++__tick; } __rows = __list; __keys[__a] = __ka; __keys[__b] = __kb; __selected = __props["selected"]; return true; };
  const __swapTwo = (__list, __nextKeys, __props) => { if (__nextKeys.length !== __keys.length) return false; let __a = -1, __b = -1; for (let __i = 0; __i < __keys.length; __i++) { if (__keys[__i] !== __nextKeys[__i]) { if (__a < 0) __a = __i; else if (__b < 0) __b = __i; else return false; } } if (__b < 0 || __keys[__a] !== __nextKeys[__b] || __keys[__b] !== __nextKeys[__a]) return false; const __entryA = __entries[__a], __entryB = __entries[__b], __A = __entryA && __entryA.root, __B = __entryB && __entryB.root; if (!__A || !__B) return false; const __afterA = __A.nextSibling, __afterB = __B.nextSibling; __container.insertBefore(__B, __afterA); __container.insertBefore(__A, __afterB); __entries[__a] = __entryB; __entries[__b] = __entryA; if (__props["selected"] !== __selected) { __touchMoved(__list[__a], __a, __nextKeys[__a], __props); __touchMoved(__list[__b], __b, __nextKeys[__b], __props); } else { __entryB.item = __list[__a]; __entryB.index = __a; __entryB.lastUsed = ++__tick; __entryA.item = __list[__b]; __entryA.index = __b; __entryA.lastUsed = ++__tick; } __rows = __list; __keys = __nextKeys; __selected = __props["selected"]; return true; };
  const __clearDom = () => { const __parent = __container.parentNode; if (__parent) { const __fresh = __container.cloneNode(false); __parent.replaceChild(__fresh, __container); __container = __fresh; } else { __container.replaceChildren(); } };
  const __applySlice = (__list, __props) => { const __s = __props && __props.__velaSlice; if (!__s) return __list; const __start = Math.max(0, __s.start | 0); const __end = Math.min(__list.length, __s.end | 0); if (__start >= __end) return []; if (__start === 0 && __end === __list.length) return __list; return __list.slice(__start, __end); };
  return {
    clear(__props) { __clearDom(); __rows = []; __keys = []; __entries = []; __selected = __props["selected"]; __prune(__props); },
    sync(__list, __props) {
      __list = Array.isArray(__list) ? __list : [];
      __list = __applySlice(__list, __props);
      if (__keys.length > 0 && __list.length > __keys.length) { const __oldLen = __keys.length; let __prefixSame = (__list === __rows); if (!__prefixSame) { __prefixSame = true; for (let __i = 0; __i < __oldLen; __i++) { if (__list[__i] === __rows[__i]) continue; if (__key(__list[__i], __i, __props) !== __keys[__i]) { __prefixSame = false; break; } } } if (__prefixSame) { const __freshKeys = __appendFreshBatch(__list, __oldLen, __props); if (__freshKeys) { for (let __i = 0; __i < __freshKeys.length; __i++) __keys.push(__freshKeys[__i]); } else { __appendBatch(__list, __oldLen, __props); for (let __i = __oldLen; __i < __list.length; __i++) __keys.push(__key(__list[__i], __i, __props)); } __rows = __list; __selected = __props["selected"]; __prune(__props); return; } }
      if (__list.length === 0) { __clearDom(); __rows = []; __keys = []; __entries = []; __selected = __props["selected"]; __prune(__props); return; }
      if (__keys.length > 0 && __list.length === __keys.length) { if (__list === __rows) { let __first = -1, __second = -1, __sameKeys = true; for (let __i = 0; __i < __keys.length; __i++) { if (__key(__list[__i], __i, __props) === __keys[__i]) continue; if (__first < 0) __first = __i; else if (__second < 0) __second = __i; else { __sameKeys = false; break; } } if (__first < 0) { __patchSame(__list, __props); __prune(__props); return; } if (__sameKeys && __second >= 0 && __swapKnownTwo(__list, __first, __second, __props)) { __prune(__props); return; } } else { let __first = -1, __second = -1, __sameRefs = true; for (let __i = 0; __i < __keys.length; __i++) { if (__list[__i] === __rows[__i]) continue; if (__first < 0) __first = __i; else if (__second < 0) __second = __i; else { __sameRefs = false; break; } } if (__sameRefs) { if (__first < 0) { __patchSame(__list, __props); __prune(__props); return; } if (__second >= 0 && __swapKnownTwo(__list, __first, __second, __props)) { __prune(__props); return; } } let __sameKeys = true; for (let __i = 0; __i < __keys.length; __i++) { if (__list[__i] === __rows[__i]) continue; if (__key(__list[__i], __i, __props) !== __keys[__i]) { __sameKeys = false; break; } } if (__sameKeys) { __patchSame(__list, __props); __prune(__props); return; } } }
      const __nextKeys = __keysFor(__list, __props);
      if (__rows.length === 0) { (__bank.size === 0 ? __appendColdBatch : __appendBatch)(__list, 0, __props); __rows = __list; __keys = __nextKeys; __selected = __props["selected"]; __prune(__props); return; }
      if (__sameOrder(__nextKeys)) { __patchSame(__list, __props); __keys = __nextKeys; __prune(__props); return; }
      if (__nextKeys.length > __keys.length && __samePrefix(__nextKeys)) { __appendBatch(__list, __keys.length, __props); __rows = __list; __keys = __nextKeys; __prune(__props); return; }
      if (__removeOne(__list, __nextKeys, __props)) { __prune(__props); return; }
      if (__swapTwo(__list, __nextKeys, __props)) { __prune(__props); return; }
      __renderAll(__list, __nextKeys, __props); __prune(__props);
    },
    hydrate(__list, __props) {
      __list = Array.isArray(__list) ? __list : [];
      __list = __applySlice(__list, __props);
      __rows = __list; __keys = __keysFor(__list, __props); __entries = new Array(__list.length); __selected = __props["selected"]; __bank.clear();
      const __roots = Array.from(__container.children);
      for (let __i = 0; __i < __list.length; __i++) { const __root = __roots[__i]; if (!__root) continue; const __row = __list[__i]; const __k = __keys[__i]; const __entry = __hydrate(__root); __entry.key = __k; __entry.item = __row; __entry.index = __i; __entry.lastUsed = ++__tick; __entries[__i] = __entry; __bank.set(__k, __entry); __update(__entry, __row, __i, __props); }
    },
    stats() { return { bankSize: __bank.size, activeRows: __rows.length, keyCount: __keys.length, maxBank: __maxBank(__initialProps, __keys.length), ticks: __tick, rowUpdates: __rowUpdates, bindingsEvaluated: __bindingsEvaluated }; },
    destroy() { __clearDom(); __rows = []; __keys = []; __entries = []; __selected = undefined; __bank.clear(); }
  };
}
function hydrateBenchmarkTable(target, props = {}) {
  const __root = target.firstElementChild;
  if (!__root || __root.getAttribute("data-vela-ssr") !== "1" || __root.getAttribute("data-vela-comp") !== "BenchmarkTable") { console.warn("Vela hydration mismatch for BenchmarkTable; falling back to mount."); return mountBenchmarkTable(target, props); }
  return __hydrateBenchmarkTableRowBank(target, props);
}
function mountBenchmarkTable(target, props = {}, opts = {}) {
  if (opts && opts.ssr) return hydrateBenchmarkTable(target, props);
  return __mountBenchmarkTableRowBank(target, props);
}
const BenchmarkTablePatchPlan = [
  {
    "id": "b0",
    "kind": "list-keyed",
    "expr": "rows",
    "key": "row.id",
    "path": [
      1
    ]
  },
  {
    "id": "b1",
    "kind": "attr",
    "attr": "class",
    "expr": "selected === row.id ? 'danger' : ''",
    "path": [
      1,
      1
    ],
    "parentRegionId": "b0"
  },
  {
    "id": "b2",
    "kind": "text",
    "expr": "String((row.id) ?? \"\")",
    "path": [
      1,
      1,
      1,
      0
    ],
    "parentRegionId": "b0"
  },
  {
    "id": "b3",
    "kind": "text",
    "expr": "String((row.label) ?? \"\")",
    "path": [
      1,
      1,
      3,
      0,
      0
    ],
    "parentRegionId": "b0"
  }
];
const BenchmarkTableManifest = {
  "name": "BenchmarkTable",
  "propsType": "BenchmarkTableProps",
  "resumable": false,
  "params": [
    {
      "name": "rows",
      "optional": false,
      "type": "Row[]"
    },
    {
      "name": "selected",
      "optional": false,
      "type": "number | null"
    }
  ],
  "states": [],
  "patchPlan": [
    {
      "id": "b0",
      "kind": "list-keyed",
      "expr": "rows",
      "key": "row.id",
      "path": [
        1
      ]
    },
    {
      "id": "b1",
      "kind": "attr",
      "attr": "class",
      "expr": "selected === row.id ? 'danger' : ''",
      "path": [
        1,
        1
      ],
      "parentRegionId": "b0"
    },
    {
      "id": "b2",
      "kind": "text",
      "expr": "String((row.id) ?? \"\")",
      "path": [
        1,
        1,
        1,
        0
      ],
      "parentRegionId": "b0"
    },
    {
      "id": "b3",
      "kind": "text",
      "expr": "String((row.label) ?? \"\")",
      "path": [
        1,
        1,
        3,
        0,
        0
      ],
      "parentRegionId": "b0"
    }
  ],
  "optimizer": {
    "kind": "direct-dom-row-bank-tree",
    "listExpr": "rows",
    "itemName": "row",
    "indexName": "i",
    "keyExpr": "row.id",
    "rowTag": "tr",
    "containerPath": [],
    "memory": {
      "bounded": true,
      "defaultMaxBank": 4096,
      "prop": "__velaMaxBank",
      "prunesInactiveRows": true
    },
    "nestedRegionCount": 0,
    "bindings": [
      {
        "kind": "attr",
        "id": "rb0",
        "expr": "selected === row.id ? 'danger' : ''",
        "attr": "class",
        "path": []
      },
      {
        "kind": "text",
        "id": "rb1",
        "expr": "row.id",
        "path": [
          0,
          0
        ]
      },
      {
        "kind": "text",
        "id": "rb2",
        "expr": "row.label",
        "path": [
          1,
          0,
          0
        ]
      }
    ]
  }
};
const BenchmarkTable = { render: renderBenchmarkTable, mount: mountBenchmarkTable, hydrate: hydrateBenchmarkTable, manifest: BenchmarkTableManifest, patchPlan: BenchmarkTablePatchPlan };
const VelaFileManifest = {
  "file": "/private/tmp/vela-jfb-upstream/frameworks/keyed/vela/src/BenchmarkTable.vela",
  "components": [
    {
      "name": "BenchmarkTable",
      "propsType": "BenchmarkTableProps",
      "resumable": false,
      "params": [
        {
          "name": "rows",
          "optional": false,
          "type": "Row[]"
        },
        {
          "name": "selected",
          "optional": false,
          "type": "number | null"
        }
      ],
      "states": [],
      "patchPlan": [
        {
          "id": "b0",
          "kind": "list-keyed",
          "expr": "rows",
          "key": "row.id",
          "path": [
            1
          ]
        },
        {
          "id": "b1",
          "kind": "attr",
          "attr": "class",
          "expr": "selected === row.id ? 'danger' : ''",
          "path": [
            1,
            1
          ],
          "parentRegionId": "b0"
        },
        {
          "id": "b2",
          "kind": "text",
          "expr": "String((row.id) ?? \"\")",
          "path": [
            1,
            1,
            1,
            0
          ],
          "parentRegionId": "b0"
        },
        {
          "id": "b3",
          "kind": "text",
          "expr": "String((row.label) ?? \"\")",
          "path": [
            1,
            1,
            3,
            0,
            0
          ],
          "parentRegionId": "b0"
        }
      ],
      "optimizer": {
        "kind": "direct-dom-row-bank-tree",
        "listExpr": "rows",
        "itemName": "row",
        "indexName": "i",
        "keyExpr": "row.id",
        "rowTag": "tr",
        "containerPath": [],
        "memory": {
          "bounded": true,
          "defaultMaxBank": 4096,
          "prop": "__velaMaxBank",
          "prunesInactiveRows": true
        },
        "nestedRegionCount": 0,
        "bindings": [
          {
            "kind": "attr",
            "id": "rb0",
            "expr": "selected === row.id ? 'danger' : ''",
            "attr": "class",
            "path": []
          },
          {
            "kind": "text",
            "id": "rb1",
            "expr": "row.id",
            "path": [
              0,
              0
            ]
          },
          {
            "kind": "text",
            "id": "rb2",
            "expr": "row.label",
            "path": [
              1,
              0,
              0
            ]
          }
        ]
      }
    }
  ],
  "imports": [],
  "actions": [],
  "apis": []
};


// This file is folded into dist/main.js by build.mjs after compiling
// src/BenchmarkTable.vela with the Vela compiler. It mirrors the
// js-framework-benchmark keyed table button and DOM contract.
const ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const COLOURS = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
const ADJECTIVES_LEN = ADJECTIVES.length;
const COLOURS_LEN = COLOURS.length;
const NOUNS_LEN = NOUNS.length;
const LABELS = [];
for (let i = 0; i < ADJECTIVES_LEN; i++) {
  for (let j = 0; j < COLOURS_LEN; j++) {
    for (let k = 0; k < NOUNS_LEN; k++) {
      LABELS[(i * COLOURS_LEN + j) * NOUNS_LEN + k] = ADJECTIVES[i] + " " + COLOURS[j] + " " + NOUNS[k];
    }
  }
}
let nextId = 1;
const random = (max) => ((Math.random() * 1000 + 0.5) | 0) % max;
function fillData(data, start, count) {
  for (let i = 0; i < count; i++) {
    data[start + i] = {
      id: nextId++,
      label: LABELS[(random(ADJECTIVES_LEN) * COLOURS_LEN + random(COLOURS_LEN)) * NOUNS_LEN + random(NOUNS_LEN)]
    };
  }
  return data;
}
function buildData(count) {
  return fillData(new Array(count), 0, count);
}
function appendData(data, count) {
  const start = data.length;
  data.length = start + count;
  return fillData(data, start, count);
}
function button(id, text) {
  return `<div class="col-sm-6 smallpad"><button id="${id}" class="btn btn-primary btn-block" type="button">${text}</button></div>`;
}
const main = document.getElementById('main');
main.innerHTML =
  '<div class="container"><div class="jumbotron"><div class="row"><div class="col-md-6"><h1>Vela</h1></div><div class="col-md-6"><div class="row">' +
  button('run', 'Create 1,000 rows') +
  button('runlots', 'Create 10,000 rows') +
  button('add', 'Append 1,000 rows') +
  button('update', 'Update every 10th row') +
  button('clear', 'Clear') +
  button('swaprows', 'Swap Rows') +
  '</div></div></div></div><table id="vela-table-host" class="table table-hover table-striped test-data"></table><span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span></div>';
let rows = [];
let selected = null;
const tableHost = document.getElementById('vela-table-host');
const viewProps = { rows, selected, __velaMaxBank: 20000 };
const mounted = mountBenchmarkTable(tableHost, viewProps);
tableHost.removeAttribute('id');
function ensurePatchStyle() {
}
function sync() {
  viewProps.rows = rows;
  viewProps.selected = selected;
  mounted.update();
}
function run() { rows = buildData(1000); selected = null; sync(); }
function runLots() { rows = buildData(10000); selected = null; sync(); }
function add() { appendData(rows, 1000); sync(); }
function update() {
  const next = rows.slice();
  for (let i = 0; i < rows.length; i += 10) {
    const row = rows[i];
    next[i] = { id: row.id, label: row.label + ' !!!' };
  }
  rows = next;
  sync();
}
function clear() {
  rows = [];
  selected = null;
  viewProps.rows = rows;
  viewProps.selected = selected;
  mounted.clear();
}
function swapRows() {
  if (rows.length > 998) {
    const next = rows.slice();
    const tmp = next[1];
    next[1] = next[998];
    next[998] = tmp;
    rows = next;
    sync();
  }
}
function remove(id) {
  rows = rows.filter(row => row.id !== id);
  if (selected === id) selected = null;
  sync();
}
function select(id) { selected = id; sync(); }

document.getElementById('run').onclick = run;
document.getElementById('runlots').onclick = runLots;
document.getElementById('add').onclick = add;
document.getElementById('update').onclick = update;
document.getElementById('clear').onclick = clear;
document.getElementById('swaprows').onclick = swapRows;

tableHost.addEventListener('click', (event) => {
  const rowEl = event.target.closest('tr');
  if (!rowEl) return;
  const cell = event.target.closest('td');
  if (!cell || cell.parentNode !== rowEl) return;
  const id = Number(rowEl.firstElementChild?.textContent || 0);
  if (cell === rowEl.children[2]) remove(id);
  else if (cell === rowEl.children[1]) select(id);
});

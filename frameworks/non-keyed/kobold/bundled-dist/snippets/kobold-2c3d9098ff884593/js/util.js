const fragmentDecorators = new WeakMap();

export function appendChild(n,c) { n.appendChild(c); }
export function appendBefore(n,i) { n.before(i); }
export function removeNode(n) { n.remove(); }
export function replaceNode(o,n) { o.replaceWith(n); }
export function emptyNode() { return document.createTextNode(""); }
export function fragment()
{
	let f = document.createDocumentFragment();
	f.append("", "");
	return f;
};
export function fragmentDecorate(f) {
	fragmentDecorators.set(f, [f.firstChild, f.lastChild]);
	return f.lastChild;
}
export function fragmentUnmount(f)
{
	let [b, e] = fragmentDecorators.get(f);
	while (b.nextSibling !== e) f.appendChild(b.nextSibling);
	f.appendChild(e);
	f.insertBefore(b, f.firstChild);
}
export function fragmentReplace(f,n)
{
	let [b, e] = fragmentDecorators.get(f);
	while (b.nextSibling !== e) f.appendChild(b.nextSibling);
	b.replaceWith(n);
	f.appendChild(e);
	f.insertBefore(b, f.firstChild);
}
export function setTextContent(n,t) { n.textContent = t; }
export function setAttribute(n,a,v) { n.setAttribute(a, v); }

export function setChecked(n,v) { if (n.checked !== v) n.checked = v; }
export function setClassName(n,v) { n.className = v; }
export function setHref(n,v) { n.href = v; }
export function setStyle(n,v) { n.style = v; }
export function setValue(n,v) { n.value = v; }

export function addClass(n,v) { n.classList.add(v); }
export function removeClass(n,v) { n.classList.remove(v); }
export function replaceClass(n,o,v) { n.classList.replace(o,v); }
export function toggleClass(n,c,v) { n.classList.toggle(c,v); }

export function makeEventHandler(c,f) { return (e) => koboldCallback(e,c,f); }
export function checkEventHandler() { if (typeof koboldCallback !== "function") console.error(
`Missing \`koboldCallback\` in global scope.
Add the following to your Trunk.toml:

[build]
pattern_script = "<script type=\\"module\\">import init, { koboldCallback } from '{base}{js}';init('{base}{wasm}');window.koboldCallback = koboldCallback;</script>"
`) }

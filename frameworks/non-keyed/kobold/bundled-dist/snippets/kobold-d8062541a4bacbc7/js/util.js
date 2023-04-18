const fragmentDecorators = new WeakMap();

export function __kobold_append(n,c) { n.appendChild(c); }
export function __kobold_before(n,i) { n.before(i); }
export function __kobold_unmount(n) { n.remove(); }
export function __kobold_replace(o,n) { o.replaceWith(n); }
export function __kobold_empty_node() { return document.createTextNode(""); }
export function __kobold_fragment()
{
	let f = document.createDocumentFragment();
	f.append("", "");
	return f;
};
export function __kobold_fragment_decorate(f) {
	fragmentDecorators.set(f, [f.firstChild, f.lastChild]);
	return f.lastChild;
}
export function __kobold_fragment_append(f,c) { fragmentDecorators.get(f)[1].before(c); }
export function __kobold_fragment_unmount(f)
{
	let [b, e] = fragmentDecorators.get(f);
	while (b.nextSibling !== e) f.appendChild(b.nextSibling);
	f.appendChild(e);
	f.insertBefore(b, f.firstChild);
}
export function __kobold_fragment_replace(f,n)
{
	let [b, e] = fragmentDecorators.get(f);
	while (b.nextSibling !== e) f.appendChild(b.nextSibling);
	b.replaceWith(n);
	f.appendChild(e);
	f.insertBefore(b, f.firstChild);
}
export function __kobold_set_text(n,t) { n.textContent = t; }
export function __kobold_set_attr(n,a,v) { n.setAttribute(a, v); }

export function __kobold_checked(n,v) { if (n.checked !== v) n.checked = v; }
export function __kobold_class_name(n,v) { n.className = v; }
export function __kobold_href(n,v) { n.href = v; }
export function __kobold_style(n,v) { n.style = v; }
export function __kobold_value(n,v) { n.value = v; }

export function __kobold_add_class(n,v) { n.classList.add(v); }
export function __kobold_remove_class(n,v) { n.classList.remove(v); }
export function __kobold_replace_class(n,o,v) { n.classList.replace(o,v); }
export function __kobold_toggle_class(n,c,v) { n.classList.toggle(c,v); }

// Sparse display host. Only instance roots and declared targets are indexed.
const owners = new WeakMap();
export function createHost(root, ingress) {
    if (owners.has(root) || root.childNodes.length) throw Error('template root must be empty and unclaimed');
    const host = { root, templates: [], instances: new Map(), events: new WeakMap(), closed: false };
    host.listener = event => {
        if (host.closed) return;
        for (const node of event.composedPath()) {
            if (node === root) break;
            const target = host.events.get(node);
            if (target && host.instances.has(target.id)) ingress(target.id, target.slot);
        }
    };
    root.addEventListener('click', host.listener);
    owners.set(root, host);
    return host;
}
export function defineTemplate(host, wire) {
    const [roots, targets] = JSON.parse(wire), doc = host.root.ownerDocument;
    const make = node => {
        if (node[0] === 0) return doc.createTextNode(node[1]);
        if (node[0] === 2) return doc.createComment('');
        const element = doc.createElement(node[1]);
        for (const [name, value] of node[2]) element.setAttribute(name, value);
        for (const child of node[3]) element.appendChild(make(child));
        return element;
    };
    const prototype = roots.map(make);
    const id = host.templates.length;
    const rangeRoots = new Set(targets.filter(([path,type]) => path.length === 1 && type === 4).map(([path]) => path[0]));
    host.templates.push({ roots: prototype, targets, rangeRoots });
    return id;
}
export function childContainer(host, id, slot) {
    const instance = host.instances.get(id);
    if (host.closed || !instance || instance.template.targets[slot]?.[1] !== 3)
        throw Error('not a live widget container');
    return instance.targets[slot];
}
function rangeNodes(instance) {
    if (!instance.spans) return instance.roots;
    const nodes = [];
    for (const [start, end] of instance.spans) {
        for (let node = start; node;) {
            nodes.push(node);
            if (node === end) break;
            node = node.nextSibling;
            if (!node) throw Error('broken template root range');
        }
    }
    return nodes;
}
function move(host, instance, parentId, parentSlot, beforeId, movement) {
    if (beforeId !== 0 && host.instances.get(beforeId) === instance) return;
    const owner = parentId === 0 ? null : host.instances.get(parentId);
    const target = owner ? owner.targets[parentSlot] : host.root;
    const end = owner && owner.template.targets[parentSlot][1] === 4 ? target : null;
    const parent = end ? end.parentNode : target;
    const anchor = beforeId === 0 ? null : host.instances.get(beforeId);
    const before = anchor ? (anchor.spans ? anchor.spans[0][0] : anchor.roots[0]) : end;
    if (before && before.parentNode !== parent) throw Error('foreign template insertion anchor');
    const nodes = rangeNodes(instance);
    const connected = nodes.some(node => node.isConnected);
    const atomic = connected && parent.isConnected && typeof parent.moveBefore === 'function';
    const doc = host.root.ownerDocument;
    const active = connected && !atomic ? doc.activeElement : null;
    const restore = active && nodes.some(node => node.contains(active));
    // moveBefore preserves focus, but Chromium can still retarget DOM ranges.
    // Selection getters can flush layout after a previous DOM move. Snapshot
    // before a consecutive move run; any other command is an ordering barrier.
    if (connected && movement.snapshot === undefined) {
        const selection = doc.getSelection();
        movement.snapshot = selection && selection.anchorNode
            ? { selection, endpoints: [selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset] }
            : null;
    }
    const snapshot = connected ? movement.snapshot : null;
    const saved = snapshot && nodes.some(node => node.contains(snapshot.endpoints[0]) || node.contains(snapshot.endpoints[2]));
    for (const node of nodes) {
        if (node === before) continue;
        if (atomic) parent.moveBefore(node, before); else parent.insertBefore(node, before);
    }
    if (restore && doc.activeElement !== active) active.focus({ preventScroll: true });
    if (saved) snapshot.selection.setBaseAndExtent(...snapshot.endpoints);
}
export function submit(host, borrowed, strings) {
    // Never retain a borrowed WASM view across native hooks/memory.grow.
    const records = borrowed.slice();
    let completed = 0;
    let movement = null;
    try {
        if (host.closed) throw Error('closed template host');
        for (let i = 0; i < records.length; i += 8) {
            const kind = records[i], id = records[i+1], slot = records[i+2];
            if (kind !== 3) movement = null;
            if (kind === 1) {
                const template = host.templates[slot];
                const roots = template.roots.map(node => node.cloneNode(true));
                const targets = template.targets.map(([path, type]) => {
                    let node = roots[path[0]];
                    // Avoid materializing a live NodeList for every path step.
                    // Keep indexed access for wide templates: repeatedly walking
                    // a large sibling offset would make target lookup quadratic.
                    for (let j = 1; j < path.length; j++) {
                        const index = path[j];
                        if (index > 3) node = node.childNodes[index];
                        else {
                            node = node.firstChild;
                            for (let k = 0; k < index; k++) node = node.nextSibling;
                        }
                    }
                    if (!node || node.nodeType !== (type === 0 ? 3 : type === 4 ? 8 : 1)) throw Error('template target shape changed');
                    return node;
                });
                const spans = template.rangeRoots.size ? roots.map((node,index) => {
                    if (!template.rangeRoots.has(index)) return [node,node];
                    const start = host.root.ownerDocument.createComment('');
                    const fragment = host.root.ownerDocument.createDocumentFragment();
                    fragment.append(start,node);
                    return [start,node];
                }) : null;
                if (host.instances.has(id)) throw Error('duplicate template instance');
                for (let slot = 0; slot < targets.length; slot++) if (template.targets[slot][1] === 2) host.events.set(targets[slot], { id, slot });
                host.instances.set(id, { roots, spans, targets, template });
            } else if (kind === 2) {
                const instance = host.instances.get(id), definition = instance.template.targets[slot];
                const value = strings.substring(records[i+3], records[i+4]);
                if (definition[1] === 0) instance.targets[slot].nodeValue = value;
                else if (definition[1] === 1) instance.targets[slot].setAttribute(definition[2], value);
                else throw Error('not a writable template slot');
            } else if (kind === 5) {
                const instance = host.instances.get(id), definition = instance.template.targets[slot];
                if (definition[1] !== 5) throw Error('not a class toggle slot');
                instance.targets[slot].classList.toggle(definition[2], records[i+3] !== 0);
            } else if (kind === 3) {
                movement ??= {};
                move(host, host.instances.get(id), slot, records[i+3], records[i+4], movement);
            } else if (kind === 4) {
                const instance = host.instances.get(id);
                for (const node of rangeNodes(instance)) node.remove();
                for (let slot = 0; slot < instance.targets.length; slot++) if (instance.template.targets[slot][1] === 2) host.events.delete(instance.targets[slot]);
                instance.targets.fill(null);
                instance.roots.length = 0;
                if (instance.spans) instance.spans.length = 0;
                host.instances.delete(id);
            } else throw Error('unknown template operation');
            completed++;
        }
        return [completed, null];
    } catch (error) { return [completed, String(error)]; }
}
export function destroyHost(host) {
    if (host.closed) return;
    host.closed = true;
    host.root.removeEventListener('click', host.listener);
    try {
        if (owners.get(host.root) === host) host.root.replaceChildren();
    } finally {
        if (owners.get(host.root) === host) owners.delete(host.root);
        host.instances.clear(); host.templates.length = 0; host.events = new WeakMap();
    }
}


export function gloryPlan(root, parts, owners, virtualParts, fields) {
    const positions = new Map(parts.map((part, index) => [part, index]));
    // Parts are registered in construction order. Each non-root part can be
    // found from one earlier part, without retracing ancestors from the root
    // or obtaining a live childNodes collection for every path segment.
    const links = parts.map((part, index) => {
        if (part === root) return null;
        const previous = part.previousSibling;
        const source = positions.get(previous || part.parentNode);
        if (source === undefined || source >= index) throw new Error('Invalid physical plan order');
        return [source, !!previous];
    });
    return { root, links, owners, virtualParts, fields };
}
export function gloryClonePlan(plan, tokens, live) {
    const root = plan.root.cloneNode(true);
    const parts = new Array(plan.links.length);
    for (let index = 0; index < parts.length; index++) {
        const link = plan.links[index];
        parts[index] = link === null ? root : link[1] ? parts[link[0]].nextSibling : parts[link[0]].firstChild;
    }
    for (const [index, name, value] of plan.fields) parts[index].setAttribute(name, value);
    const identities = tokens.split('\0');
    for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        if (part.nodeType === 1) {
            part.setAttribute('data-gly-node', identities[plan.owners[index]]);
            if (live && plan.virtualParts[index]) part.setAttribute('data-gly-live', '');
        }
    }
    return parts;
}
export function gloryRetirePlanParts(plan, parts, offset, masks) {
    // The typed u32 slice is borrowed for this synchronous call only.
    for (let index = 0; index < plan.owners.length; index++) {
        const owner = plan.owners[index];
        if (masks[owner >>> 5] & (1 << (owner & 31))) parts[offset + index] = null;
    }
}
export function gloryPlanText(parts, address, value) {
    parts[address].nodeValue = value;
}
export function gloryPlanAttribute(parts, address, name, value) {
    const node = parts[address];
    if (value === undefined) node.removeAttribute(name);
    else node.setAttribute(name, value);
}
export function gloryPlanFields(parts, records, strings) {
    // Native event ingress can reenter WASM and grow its memory during a DOM
    // write. Snapshot this bounded borrowed view before the first host call.
    const fields = records.slice();
    let start = 0;
    for (let index = 0; index < fields.length; index += 4) {
        const node = parts[fields[index]], kind = fields[index + 1];
        const nameEnd = fields[index + 2], valueEnd = fields[index + 3];
        const value = strings.substring(nameEnd, valueEnd);
        if (kind === 0) node.nodeValue = value;
        else {
            const name = strings.substring(start, nameEnd);
            if (kind === 1) node.setAttribute(name, value);
            else if (kind === 2) node.removeAttribute(name);
            else throw new Error('Invalid Plan field kind');
        }
        start = valueEnd;
    }
}
export function gloryPlaceDetachedPlan(parts, address, parent, before, rangeEnd) {
    const node = parts[address];
    // Connected moves keep the existing Rust focus/selection/IME path. This
    // reply is observation only: no partial mutation precedes the fallback.
    if (node.isConnected) return 0;
    const container = rangeEnd ? parent.parentNode : parent;
    if (!container) return 2;
    container.insertBefore(node, before || (rangeEnd ? parent : null));
    return 1;
}
export function gloryRemovePlanPart(parts, address) {
    const node = parts[address], parent = node.parentNode;
    if (parent) parent.removeChild(node);
}
export function gloryReleasePlan(parts, start, count) {
    parts.fill(null, start, start + count);
}
export function glorySubmitPlans(objects, borrowed, strings, created, live) {
    // DOM hooks can reenter WASM and grow memory. All inputs below are owned
    // by JS before the first DOM operation; never keep a borrowed WASM view.
    const records = borrowed.slice();
    const node = (object, address) => address === 4294967295 ? objects[object] : objects[object][address];
    let completed = 0;
    try {
        for (let i = 0; i < records.length; i += 10) {
            const kind = records[i], object = records[i+1], address = records[i+2];
            if (kind === 0) { completed++; continue; }
            if (kind === 1) {
                const parts = gloryClonePlan(objects[object], strings.substring(records[i+8], records[i+9]), live);
                for (let j = 0; j < parts.length; j++) created[address+j] = parts[j];
            } else if (kind === 2) {
                node(object, address).nodeValue = strings.substring(records[i+8], records[i+9]);
            } else if (kind === 3 || kind === 4) {
                const target = node(object, address), name = strings.substring(records[i+7], records[i+8]);
                if (kind === 3) target.setAttribute(name, strings.substring(records[i+8], records[i+9]));
                else target.removeAttribute(name);
            } else if (kind === 5) {
                const target = node(object, address);
                // Preserve the existing connected-move selection/IME path.
                if (target.isConnected) return [completed, 1, null];
                const destination = node(records[i+3], records[i+4]);
                const parent = records[i+7] ? destination.parentNode : destination;
                if (!parent) throw new Error('detached Group end');
                const before = records[i+5] === 4294967295 ? (records[i+7] ? destination : null) : node(records[i+5], records[i+6]);
                parent.insertBefore(target, before);
            } else if (kind === 6) {
                const target = node(object, address);
                // Focus retirement removes Rust lookups before native loss
                // callbacks. Keep that existing path for a focused subtree.
                const active = target.getRootNode().activeElement;
                if (active && target.contains(active)) return [completed, 1, null];
                if (target.parentNode) target.parentNode.removeChild(target);
                objects[object].fill(null, records[i+3], records[i+4]);
            } else throw new Error('unknown Plan submission operation');
        }
        return [completed, 0, null];
    } catch (error) { return [completed, 2, String(error)]; }
}

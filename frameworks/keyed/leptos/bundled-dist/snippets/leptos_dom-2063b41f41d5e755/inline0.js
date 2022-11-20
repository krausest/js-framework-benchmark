export function append_nodes(parent, newNodes, marker) {
    const nodes = [];
    for(const node of newNodes) {
        nodes.push(parent.insertBefore(node, marker));
    }
    return nodes;
}
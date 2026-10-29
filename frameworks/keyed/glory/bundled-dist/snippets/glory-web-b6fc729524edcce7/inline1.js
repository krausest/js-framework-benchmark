
export function gloryCloneElement(prototype, classes, style, token, live) {
    const element = prototype.cloneNode(false);
    if (classes != null) element.setAttribute('class', classes);
    if (style != null) element.setAttribute('style', style);
    element.setAttribute('data-gly-node', token);
    if (live) element.setAttribute('data-gly-live', '');
    return element;
}

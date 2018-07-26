import _ from 'underscore';

export default {
    getEl(selector) {
        return [selector];
    },

    findEl(el, selector) {
        return el.querySelectorAll(selector);
    },

    detachEl(el) {
        if (el.parentNode) el.parentNode.removeChild(el);
    },

    hasContents(el) {
        return el.hasChildNodes();
    },

    setContents(el, html) {
        el.innerHTML = html
    },

    appendContents(el, contents) {
        el.appendChild(contents)
    },

    detachContents(el) {
        el.textContent = '';
    }
};

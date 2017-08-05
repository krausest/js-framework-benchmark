import _ from 'underscore';

export default {
    getEl(selector) {
        if (_.isObject(selector)) {
            return [selector]
        }  else {
            return document.querySelectorAll(selector);
        }
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
        if (html) el.innerHTML = html
    },

    appendContents(el, contents) {
        el.appendChild(contents)
    },

    detachContents(el) {
        // Handles bugfix coming in v3.4.1
        if (!el) return;
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }
};

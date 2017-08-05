const morphdom = require('morphdom');

export default function(template, data) {
    const el = template(data);
    if(this.isRendered()) morphdom(this.el, el, { childrenOnly: true });
    else this.setElement(el.cloneNode(true));
}
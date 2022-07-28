import morphdom from 'morphdom';

export default function(template, data) {
    const el = template(data);
    if(this.isRendered()) morphdom(this.el, el);
    else this.setElement(el.cloneNode(true));
}